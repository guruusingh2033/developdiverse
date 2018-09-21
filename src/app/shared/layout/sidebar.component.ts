import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { JobService, Job } from '../../core';

@Component({
  selector: 'app-layout-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  jobID:number;
  constructor(
    private userService: UserService,
    private router: Router,
    private jobService:JobService,
    private route:ActivatedRoute

  ) {}

  currentUser: User;

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
        //console.log(userData)
      }
    );
  }

  // download a docs job file
  download(){

    this.route.queryParams
    .filter(params => params.data)
    .subscribe(params => {
    //  console.log(params); // {order: "popular"}

      this.jobID = params.data;
     // console.log(this.jobID); // popular
    });
    if(this.jobID){
    var job = { "jobad_id": this.jobID}
    // this.jobService.download(job).subscribe(
    //   (jobData) => {
    //     console.log(jobData)
    //   }
    // );
   this.jobService.downloadFile(job);
  }
  }

  logout() {
   // this.userService.purgeAuth();
    this.userService.purgeAuthInterceptor();
   // this.router.navigateByUrl('/');
  }

  // loads job editor
  loadJobEditor() {
   // this.router.navigate(['/']);
    this.router.navigate(['/dashboard/editor']);
    
  }

}
