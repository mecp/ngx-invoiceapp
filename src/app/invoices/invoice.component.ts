import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

import { InvoiceService } from '../services/invoice.service';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { SearchService } from '../services/search.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
  private sub: any;

  isInfo = false;
  isLoading = true;
  myForm: FormGroup;
  events: any[] = [];
  custSearchModel: string;
  prodSearchModel: string;

  selectedCustomer: any;
  invoiceItems: any[] = [];
  discount = 0.0;
  customerName = '';
  formTitle = '';

  formatter = (x: {name: string}) => x.name;

  maxValueValidator(ctrlKey: string, maxFn: () => {}): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        const input = control.value,
             max = maxFn(),
            isValid = input > max;
        if (isValid) {
            const res =  { };
            res[ctrlKey] = { max };
            console.log(res);
            return res;
        } else {
            return null;
        }
    };
  }

  minValueValidator(ctrlKey: string, minFn: () => {}): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        const input = control.value,
             min = minFn(),
            isValid = input < min;
        if (isValid) {
            const res =  { };
            res[ctrlKey] = { min };
            console.log(res);
            return res;
        } else {
            return null;
        }
    };
  }

  constructor(private invoiceService: InvoiceService,
              private customerService: CustomerService,
              private productService: ProductService,
              private searchService: SearchService,
              public toast: ToastComponent,
              private _fb: FormBuilder,
              private route: ActivatedRoute) { }

    ngOnInit() {
        this.myForm = this._fb.group({
            custInfo: new FormControl({value: '', disabled: true}),
            customer: ['', <any>Validators.required],
            items: [[], <any>Validators.minLength(1)],
            itemDel: [],
            discount: [0.0, Validators.compose([<any>Validators.required,
                                                this.minValueValidator('discount', () => 0),
                                                this.maxValueValidator('discount', () => this.getTotal()) ]) ],
        });

        this.isLoading = false;
        this.formTitle = 'Add New Invoice';
        this.searchCustomer = this.searchCustomer.bind(this);
        this.searchProduct = this.searchProduct.bind(this);
        this.sub = this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.isInfo = true;
                this.formTitle = 'Invoice Details';
                this.invoiceService.getInvoice(id).subscribe((inv) => {
                    this.customerService.getCustomer(inv.customer_id).subscribe((cust) => {
                        this.selectedCustomer = cust;
                        this.customerName = cust.name;
                    });
                    this.invoiceService.getInvoiceItems(id).subscribe((items) => {
                        if (items) {
                            items.forEach((item) => {
                                this.productService.getProduct(item.product_id).subscribe((prod) => {
                                    this.productSelected({ item: prod }, item.quantity);
                                });
                            });
                        }
                    });

                    this.discount = inv.discount;
                    this.myForm.controls.discount.disable();
                });
            }
        });
  }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    customerSelected(event) {
        this.selectedCustomer = event.item;
    }

    productSelected(event, quantity: number = 0) {
        const prod = event.item;
        if (!this.invoiceItems.some((item) => item.product.id === prod.id)) {
            const ctrlKey = 'item' + prod.id;
            this.myForm.addControl(ctrlKey, new FormControl({
                validator: Validators.compose([<any>Validators.required, this.minValueValidator(ctrlKey, () => 0)])
            }));
            if (this.isInfo) {
                this.myForm.controls[ctrlKey].disable();
            }
            this.invoiceItems.push({
                product: prod,
                quantity: quantity
            });
        }
    }

    isQuantityValid(item): boolean {
        if (item.quantity <= 0) {
            return false;
        } else {
            return true;
        }
    }

    getTotal() {
        let total = 0;
        this.invoiceItems.forEach((it) => total += it.product.price * it.quantity);
        return total;
    }

    getDiscountedTotal() {
        return this.getTotal() - this.discount;
    }

    delete(item) {
        this.invoiceItems = this.invoiceItems.filter((it) => it.product.id !== item.product.id);
    }

    searchCustomer(q: Observable<string>) {
        return this.search(q, 'customer');
    }

    searchProduct(q: Observable<string>) {
        return this.search(q, 'product');
    }

    search(q: Observable<string>, type) {
        return q.debounceTime(200)
         .distinctUntilChanged()
         .switchMap((term) => this.searchService.search(term, type));
    }

    save() {
        if (this.myForm.valid) {
            const invoice = {
                customer_id: this.selectedCustomer.id,
                discount: this.discount,
                total: this.getDiscountedTotal(),
                items: this.invoiceItems.map((it) => {
                    return {
                        product_id: it.product.id,
                        quantity: it.quantity,
                    };
                }),
            }

            this.invoiceService.addInvoice(invoice).subscribe((inv) => {
                this.toast.setMessage('Invoice with id ' + inv.id + 'added successfully', 'success');
            },
            error => this.toast.setMessage('Invoice couldn\'t be added', 'danger'));
        }
    }
}
