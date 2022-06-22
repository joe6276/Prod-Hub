import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, catchError, combineLatest, map, merge, Observable, scan, shareReplay, Subject, tap, throwError } from 'rxjs';

import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { SupplierService } from '../suppliers/supplier.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';

  
  
  product$= this.http.get<Product[]>(this.productsUrl)
  .pipe(
    // tap(data => console.log('Products: ', JSON.stringify(data))),
    map(product=>
      product.map(item=>({
        ...item,
          price:item.price? item.price * 2 :0
      } as Product))
    ),
    catchError(()=>throwError(()=>new Error('An error OCCured'))
    )
  );


  productwithCategories$=combineLatest([
    this.product$,
    this.Category.productCategory$
  ]).pipe(
    map(([product, category])=>
      product.map(item=>({
        ...item,
        price:item.price? item.price * 2 :0,
        category:category.find(c=>c.id===item.categoryId)?.name
      } as Product ) )
    ),
    shareReplay(1)
  )
 private selected= new BehaviorSubject<number>(0)
 productSelected$ = this.selected.asObservable()

  selectedProduct$=combineLatest([
    this.productwithCategories$,
    this.productSelected$
  ]).pipe(
    map(([product, id])=>
      product.find(p=>p.id === id)
    )
    // , tap(product=>console.log(product))
    ,shareReplay(1)
  )

  productSupplier$= combineLatest([
    this.selectedProduct$,
    this.supplier.suppliers$
  ]).pipe(
    map(([product,supplier])=>
    supplier.filter(s=>product?.supplierIds?.includes(s.id))
    )
  )


  selectedProductChange(id:number){
    this.selected.next(id)
  }
  constructor(private http: HttpClient , private supplier:SupplierService ,private Category:ProductCategoryService) { }


  private addProductSubject =new Subject<Product>()
  addProduct$= this .addProductSubject.asObservable()
 
productafteradd$=merge(
  this.productwithCategories$,
  this.addProduct$
).pipe(
  scan((accumulator, value)=>(value instanceof Array)?
   [...value]:[...accumulator,value], [] as Product[])
)

addProduct(){
   const newProduct= {
    id: 42,
    productName: 'Another One',
    productCode: 'TBX-0042',
    description: 'Our new product',
    price: 8.9,
    categoryId: 3,
    category: 'Toolbox',
    quantityInStock: 30
   }
  this.addProductSubject.next(newProduct)
}
  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
