# Dependencies

- sqlite3
- node
- npm
- Angular CLI: Install by `npm i -g @angular/cli`

# Getting Started

##### 1. Install npm dependencies
`$ npm install`

##### 2. Build Angular 4 Client App
- Without production mode:

    ```sh
    $ ng build
    ```

- With production mode enabled: 

    ```sh
    $ ng build -prod
    ```

- With AoT Compilation: 

    ```sh
    $ ng build -aot
    ```

- With AoT and production mode: 

    ```sh
    $ ng build -aot -prod
    ```

##### 3. Run the node server
`$ node app.js`

***Note:*** DB is truncated upon starting the server, so any changes made will be lost after server restart.

##### 4. Viewing the application in your browser
Open `http://localhost:8000` in the browser and start creating invoices.

# Schema

## Customers

- id (integer)
- name (string)
- address (string)
- phone (string)


## Products

- id (integer)
- name (string)
- price (decimal)

## Invoices

- id (integer)
- customer_id (integer)
- discount (decimal)
- total (decimal)

## InvoiceItems

- id (integer)
- invoice_id (integer)
- product_id (integer)
- quantity (decimal)


# Resources

## Customers
```
GET|POST          /api/customers
GET|PUT|DELETE    /api/customers/{id}
```

## Products
```
GET|POST          /api/products
GET|PUT|DELETE    /api/products/{id}
```
## Invoices
```
GET|POST          /api/invoices
GET|PUT|DELETE    /api/invoices/{id}
```

## InvoiceItems
```
GET|POST          /api/invoices/{id}/items
GET|PUT|DELETE    /api/invoices/{invoice_id}/items/{id}
```


