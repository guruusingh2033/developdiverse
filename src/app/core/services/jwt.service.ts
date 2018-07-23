import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {

  getToken(): String {
    if(window.localStorage['rememberme']=="true"){
    return window.localStorage['jwtToken'];
    }
    else{
      return window.sessionStorage['jwtToken'];

    }
    
  }

  saveToken(token: String) {
    if(window.localStorage['rememberme']=="true"){
   window.localStorage['jwtToken'] = token;
    }
    else{
     window.sessionStorage['jwtToken']=token;
    }
  }

  destroyToken() {
    if(window.localStorage['rememberme']=="true"){
      debugger;
  window.localStorage.removeItem('jwtToken');
    }
    else{
      window.sessionStorage.removeItem('jwtToken');
    }
  }

}
