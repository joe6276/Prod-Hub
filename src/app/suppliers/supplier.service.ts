import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable, of, switchMap, tap, mergeMap, concatMap, shareReplay, catchError } from 'rxjs';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';
  suppliersSwitchMap$ =of(1,5,8)
    .pipe(
      tap(id => console.log('SwitchMap Source Observable',id)),
      switchMap(id=> this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
    )

    suppliersMergeMap$ =of(1,5,8)
    .pipe(
      tap(id => console.log('MergeMap Source Observable',id)),
      mergeMap(id=> this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
    )

    suppliersConcatMap$ =of(1,5,8)
    .pipe(
      tap(id => console.log('ConcatMap Source Observable',id)),
      concatMap(id=> this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
    )

  constructor(private http: HttpClient) {
    this.suppliersSwitchMap$.subscribe(item=> console.log('SwitchMap Result', item))
    this.suppliersMergeMap$.subscribe(item=> console.log('MergeMap Result', item))
    this.suppliersConcatMap$.subscribe(item=> console.log('ConcatMap Result', item))
   }


   suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl)
   .pipe(
     tap(data => console.log('suppliers', JSON.stringify(data))),
     shareReplay (1),
     catchError(this.handleError)
   );

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
