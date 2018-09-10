import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { JobService, Job } from '../core';

@Component({
  selector: 'app-joblist-page',
  templateUrl: './joblist.component.html',
  styleUrls: ['./joblist.component.css']
})
export class JoblistComponent implements OnInit {
  //stores job list data
  joblist: any;
  joblistForm: FormGroup;
  joblistForm2: FormGroup;
  errors: Object = {};
  //changes boolean status depending on whether for submitted or in progress.
  isSubmitting = false;
  alerts: any;
  alert1: any;
  p: number = 1;
  jobType=["Draft","Shared","Approved","Finished"];
  term:any;
  
  constructor(
    private router: Router,
    private jobService: JobService,
    private spinner: NgxSpinnerService,

  ) {}

  // sets job status
  status(id){
    return this.jobType[id];
  }

  ngOnInit() {
    //console.log("------");
   // debugger;
    this.spinner.show();
    this.jobService.getJobList()
    .subscribe(
      jobList => {
        //response
        this.spinner.hide();

        this.joblist = jobList;
        this.joblist = this.joblist.reverse();
       },
      err => {
        
      }
    );

  }

// helps in redirection
  redirect(id,status){
    this.router.navigateByUrl('/dashboard/editor?data='+id+'&status='+status);

  }


}