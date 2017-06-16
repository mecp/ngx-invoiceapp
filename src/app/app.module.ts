import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from './services/product.service';
import { CustomerService } from './services/customer.service';
import { InvoiceService } from './services/invoice.service';
import { SearchService } from './services/search.service';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceComponent } from './invoices/invoice.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    CustomersComponent,
    InvoicesComponent,
    InvoiceComponent,
    NotFoundComponent
  ],
  imports: [
    RoutingModule,
    SharedModule,
    NgbModule.forRoot()
  ],
  providers: [
    ProductService,
    CustomerService,
    InvoiceService,
    SearchService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
