import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HttpResponse,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import {  Router } from '@angular/router';

import { JwtService, UserService } from '../services';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService,private router:Router,private userService:UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const token = this.jwtService.getToken();
    //debugger;
    if (token) {
      headersConfig['Authorization'] = `Token ${token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
  //  return next.handle(request);
  return next.handle(request).do((event: HttpEvent<any>) => {
    if (event instanceof HttpResponse) {
      // do stuff with response if you want
    }
  }, (err: any) => {
    if (err instanceof HttpErrorResponse) {
       // console.log(err);
      if (err.status === 401 || err.status === 403 ) {
          this.jwtService.destroyToken();
      //   this.userService.purgeAuth();

          this.router.navigateByUrl('/'); 
      }
    }
  });
  }


}
