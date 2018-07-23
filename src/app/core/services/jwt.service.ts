import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class JwtService {

  constructor( private cookieService: CookieService ) { }

  getToken(): String {
    if(window.localStorage['rememberme']=="true"){
    return window.localStorage['jwtToken'];
    }
    else{
     // return window.sessionStorage['jwtToken'];
      return  this.cookieService.get('jwtToken');;

    }
    
  }

  saveToken(token) {
    if(window.localStorage['rememberme']=="true"){
   window.localStorage['jwtToken'] = token;
    }
    else{
      this.cookieService.set( 'jwtToken', token);

   //  window.sessionStorage['jwtToken']=token;
    }
  }

  destroyToken() {
    if(window.localStorage['rememberme']=="true"){
      debugger;
  window.localStorage.removeItem('jwtToken');
    }
    else{

      this.cookieService.delete('jwtToken');

     // window.sessionStorage.removeItem('jwtToken');
    }
  }

}
