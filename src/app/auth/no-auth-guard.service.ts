import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {BehaviorSubject } from 'rxjs/BehaviorSubject'

import { UserService } from '../core';
import { map ,  take } from 'rxjs/operators';
import { JwtService } from '../core/services/jwt.service';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
    private jwtService: JwtService

  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const x = this.jwtService.getToken(); 
    debugger;
    if (x) { 
      // this.router.navigate(['/dashboard/welcome']); 
     this.router.navigate(['/profile']); 

     } else 
    { return new BehaviorSubject<boolean>(true); 
    }
  //  return this.userService.isAuthenticated.pipe(take(1), map(isAuth => !isAuth));

  }
}
