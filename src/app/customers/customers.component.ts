import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { CustomerService } from '../services/customer.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customers = [];
  isLoading = true;
  
  constructor(private customerService: CustomerService, public toast: ToastComponent) { }

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe(
      data => this.customers = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }
}