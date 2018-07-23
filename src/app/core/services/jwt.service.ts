import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class JwtService {

  constructor( private cookieService: CookieService ) { }

  getToken(): String {
    if(window.localStorage['rememberme']=="true"  ){
    return window.localStorage['jwtToken'];
    }
    else{
     // return window.sessionStorage['jwtToken'];
      // if(!this.cookieService.get('jwtToken')){
      //   return window.localStorage['jwtToken'];
      // }
      // else{
      return  this.cookieService.get('jwtToken');

     // }
    }
    
  }

  saveToken(token) {
   window.localStorage['jwtToken'] = token;
   
      this.cookieService.set( 'jwtToken', token);
  }

  destroyToken() {
    this.cookieService.delete('jwtToken');

  window.localStorage.removeItem('jwtToken');
  window.localStorage.removeItem('username');

  this.cookieService.delete('username');

     
  }

}
