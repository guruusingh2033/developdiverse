import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService,
    

  ) {}

  currentUser: User;

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
       // console.log(userData)
      }
    );
  }

  // logs user out
  logout() {
    debugger;
    this.spinner.show();
    this.userService.purgeAuthInterceptor();
    this.spinner.hide();
   // this.userService.purgeAuth();
   // this.router.navigateByUrl('/');
  }

}
