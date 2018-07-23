import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {BehaviorSubject } from 'rxjs/BehaviorSubject'
import { UserService } from './user.service';
import { take } from 'rxjs/operators';
import { JwtService } from './jwt.service';


@Injectable()
export class AuthGuard implements CanActivate {
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
    if (!x) { this.router.navigate(['/']);  } else 
    { return new BehaviorSubject<boolean>(true); 
    }
    //return this.userService.isAuthenticated.pipe(take(1));

  }
}
