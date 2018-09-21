import { Component, OnInit } from '@angular/core';
import { User, UserService, JobService } from '../../core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  isCollapsed: boolean = true;
  currentUser: User;
  jobID: number;

  constructor(
    private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private jobService: JobService,
    private route: ActivatedRoute
  ) { }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
  }

  // download a docs job file
  download() {
    this.toggleCollapse();
    this.route.queryParams
      .filter(params => params.data)
      .subscribe(params => {
        this.jobID = params.data;
      });
    if (this.jobID) {
      var job = { "jobad_id": this.jobID };
      this.jobService.downloadFile(job);
    }
  }

  // logs user out
  logout() {
    this.spinner.show();
    this.userService.purgeAuthInterceptor();
    this.spinner.hide();
    // this.userService.purgeAuth();
    // this.router.navigateByUrl('/');
  }

}
