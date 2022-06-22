import { Component, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject, catchError, combineLatest, EMPTY, map, Observable, startWith, Subject, Subscription, tap } from 'rxjs';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { SupplierService } from '../suppliers/supplier.service';

import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListComponent{
  pageTitle = 'Product List';
  errorMessage :any
 selectedId=1
private   selectedCategory= new BehaviorSubject<number>(0)
categoryaction$= this.selectedCategory.asObservable()


 categories$ = this.category.productCategory$.pipe(
  catchError(err=>{
    this.errorMessage=err
    return EMPTY
  })
 )
  filteredProducts$= this.productService.productwithCategories$.pipe(
    map(products=>
      products.filter(item =>
        item.categoryId === this.selectedId
    ),
    tap(prod=>console.log(prod))
    )
  )
  products$=combineLatest([
    this.productService.productafteradd$,
    this.categoryaction$
  ]).pipe(
    map(([products, Selectedcategory])=>
    products.filter(item=>
      Selectedcategory? item.categoryId===Selectedcategory:true)),
      catchError(error=>{
        this.errorMessage=error
        return EMPTY
      })
  
  )
  
  constructor(private productService: ProductService,  private supplier:SupplierService ,private category:ProductCategoryService) { }
  onSelected(val:string){
    this.selectedCategory.next(+val)
    console.log(val);
    
  }

  onAdd(){
    this.productService.addProduct()
  }

}
