import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { InvoiceService } from '../services/invoice.service';
import { CustomerService } from '../services/customer.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-customers',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  invoices = [];
  isLoading = true;
  customers = {};

  constructor(private invoiceService: InvoiceService,
              private customerService: CustomerService,
              public toast: ToastComponent,
              public router: Router) { }

  ngOnInit() {
    this.getInvoices();
  }

  getInvoices() {
    this.invoiceService.getInvoices().subscribe(
      data => {
        if (data) {
          data.forEach((inv) => {
            const customer_id_str = inv.customer_id + '';
            if (!this.customers[customer_id_str]) {
              this.customers[customer_id_str] = this.customerService.getCustomer(customer_id_str);
            }
          });
        }
        this.invoices = data;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getCustomerObservable(customer_id_str: string) {
    return this.customerService.getCustomer(customer_id_str);
  }

  delete(invoice) {
    this.invoiceService.deleteInvoice(invoice.id)
                        .subscribe(res => {
                          this.toast.setMessage('Invoice deleted successfully!', 'success');
                          this.invoices = this.invoices.filter(inv => inv.id !== invoice.id);
                        });
  }

  view(invoice) {
    this.router.navigate(['/invoice', invoice.id])
  }
}
