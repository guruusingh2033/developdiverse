import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { map ,  distinctUntilChanged } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  data:any;
  constructor (
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService,
    private cookieService: CookieService,
    private router: Router,


  ) {}

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
   // console.log(this.jwtService.getToken());
    if (this.jwtService.getToken()) {
      // this.apiService.get('/user')
      // .subscribe(
      //   data => this.setAuth(data.user),
      //   err => console.log(err)
      // );
      this.data = {};
      this.data.token = this.jwtService.getToken();
      if(window.localStorage['rememberme']=="true"){
      this.data.username = window.localStorage['username'];
      }
      else{
        this.data.username =   this.cookieService.get('username');

      //  this.data.username = window.sessionStorage['username'];

      }
    //  console.log(this.data.username);
      this.setAuth(this.data);

    } else {
      // Remove any potential remnants of previous auth states
     // this.purgeAuth();
    
    }
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    if(window.localStorage["rememberme"]=="true"){
    window.localStorage["username"] =  user.username;
    }
    else{
      this.cookieService.set( 'username', user.username );

     // window.sessionStorage["username"] =  user.username;

    }
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    debugger;
    this.cookieService.set( 'jwtToken','',-1);

    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  purgeAuthInterceptor(){
     this.apiService.get('/logout/')
        .subscribe(
         data =>{
           //console.log("logout" +data)
           this.purgeAuth();
           this.router.navigateByUrl('/'); 

         },
         err => {
          this.purgeAuth();
          this.router.navigateByUrl('/'); 
         console.log(err);    
          
          //  this.jwtService.destroyToken();
          //  // Set current user to an empty object
          //  this.currentUserSubject.next({} as User);
          //  // Set auth status to false
          //  this.isAuthenticatedSubject.next(false);
          //  this.router.navigateByUrl('/'); 
         }

       );
    //this.jwtService.destroyToken();

    // Set current user to an empty object
   // this.currentUserSubject.next({} as User);
    // Set auth status to false
   // this.isAuthenticatedSubject.next(false);

   // this.router.navigateByUrl('/'); 

  }



  attemptAuth(type, credentials): Observable<User> {
    const route = (type === 'login') ? '/get_auth_token/' : '/signup/';
    var rememberme = credentials.rememberme;
    delete credentials.rememberme;
    return this.apiService.post( route, credentials)
      .pipe(map(
      data => {
      ///  console.log("------");
       // console.log(data);
       // debugger;
        if(type=='login'){
        data.username = credentials.username;
        if(rememberme == true){
          localStorage.setItem("rememberme","true");
        }
        else{
          localStorage.setItem("rememberme","false");
    
        }
        this.setAuth(data);
        }
        return data;
      }
    ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService
    .put('/user', { user })
    .pipe(map(data => {
      // Update the currentUser observable
      this.currentUserSubject.next(data.user);
      return data.user;
    }));
  }

}
