import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CustomerService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getCustomers(): Observable<any> {
    return this.http.get('/api/customers').map(res => res.json());
  }

  getCustomer(id: string): Observable<any> {
    return this.http.get(`/api/customers/${id}`).map(res => res.json());
  }
}
