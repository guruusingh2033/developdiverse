import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,

  ) {}

  currentUser: User;

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
        console.log(userData)
      }
    );
  }


  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }

}
