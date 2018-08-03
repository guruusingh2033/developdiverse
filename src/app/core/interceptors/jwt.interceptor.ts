
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HttpResponse ,HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';


import 'rxjs/add/operator/do';

export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
          console.log(err);
        if (err.status === 401) {
            
        }
      }
    });
  }
}