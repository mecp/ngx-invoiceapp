import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { InvoiceService } from '../services/invoice.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-customers',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  invoices = [];
  isLoading = true;

  constructor(private invoiceService: InvoiceService, public toast: ToastComponent) { }

  ngOnInit() {
    this.getInvoices();
  }

  getInvoices() {
    this.invoiceService.getInvoices().subscribe(
      data => this.invoices = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }
}
