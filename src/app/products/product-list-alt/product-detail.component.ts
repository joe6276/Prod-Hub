import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, EMPTY, Subject } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  errorMessage = '';
  product: Product | null = null;
  productSuppliers: Supplier[] | null = null;
  errorMessageSubject= new Subject<string>()
  error$= this.errorMessageSubject.asObservable()
  product$= this.productService.selectedProduct$.pipe(
    catchError(err=>{
      this.errorMessageSubject.next(err)
      return EMPTY
    })
  )
 
  productSupplier$=this.productService.productSupplier$.pipe(
    catchError(err=>{
      this.errorMessageSubject.next(err)
            return EMPTY
    })
  )
  constructor(private productService: ProductService) { }

}
