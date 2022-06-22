import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { catchError, EMPTY, of, scan, Subject, Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent implements OnInit{
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId = 0;


numbers$ = of(1, 2, 3)
  .pipe(
    scan((accumulated, current) => [...accumulated,current],[] as number[]),
  ).subscribe(console.log);


  // numbers$ = of(1, 2, 3)
  // .pipe(
  //   scan((total, n) => total + n, 5),
  // ).subscribe(console.log);
 
   private errorMessageSubject= new Subject<string>()
   error$ =this.errorMessageSubject.asObservable()
    products$= this.productService.productwithCategories$.pipe(
    catchError(err=>{
      this.errorMessageSubject.next(err)
            return EMPTY
    })
   )
   selectedProduct$= this.productService.selectedProduct$

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
   
  }
  onSelected(productId: number): void {
    this.productService.selectedProductChange(productId)
  }
}
