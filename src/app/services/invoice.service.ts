import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class InvoiceService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getInvoices(): Observable<any> {
    return this.http.get('/api/invoices').map(res => res.json());
  }

  getInvoice(id): Observable<any> {
    return this.http.get(`/api/invoices/${id}`).map(res => res.json());
  }

  getInvoiceItems(id): Observable<any> {
    return this.http.get(`/api/invoices/${id}/items`).map(res => res.json());
  }

  addInvoice(invoice): Observable<any> {
    const body = JSON.stringify(invoice);
    return this.http.post('/api/invoices', body, this.options).map(res => res.json());
  }

  deleteInvoice(invoice_id): Observable<any> {
    return this.http.delete(`/api/invoices/${invoice_id}`).map(res => res.json());
  }
}
