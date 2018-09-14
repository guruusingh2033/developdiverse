import { Component, OnInit } from '@angular/core';

import { UserService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  hideSidebar:boolean;

  constructor (
    private userService: UserService
  ) {}

  ngOnInit() {
    
    var checkIfItemSet =  localStorage.getItem("lastUrl");
    if(!checkIfItemSet){
    localStorage.setItem("lastUrl","false");
    }

    this.userService.populate();
   // console.log("get user");
   // console.log(this.userService.getCurrentUser());
    if(typeof this.userService.getCurrentUser() == "object" && this.userService.getCurrentUser().token){
      this.hideSidebar =false;
    }
    else{
      this.hideSidebar = true;
    }
  }

}
