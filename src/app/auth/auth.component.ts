import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import {JwtService} from '../core/services/jwt.service'
import { Errors, UserService } from '../core';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']

})
export class AuthComponent implements OnInit {
  authType: String = '';
  title: String = '';
  errors: Object = {};
  isSubmitting = false;
  authForm: FormGroup;
  submit: boolean = false;
  alerts: any;
  message: string = '';
  color = 'primary';
  mode = 'determinate';
  value = 50;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private jwtService: JwtService,


  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'rememberme':['']
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = "login";
      // Set a title for the page accordingly
      this.title = 'Log in to your account';
      // add form control for username if this is the register page

    });
    this.alerts = [];

    // console.log("token-------");
    // console.log(this.cookieService.get("jwtToken"));
   var token:any =  this.jwtService.getToken();
   
   if(!token){
     token = localStorage.getItem('jwtToken');
     if(token){
      localStorage.setItem("jwtToken",token);
      this.cookieService.set("jwtToken",token);
    this.userService.purgeAuth();

     }
   }
 
   localStorage.setItem("rememberme","false");

  }

  // convenience ge  <alert [type]="alert.type" [dismissOnTimeout]="alert.timeout" (onClosed)="onClosed(alert)">{{ alert.msg }}</alert>
  get f() { return this.authForm.controls; }

  submitForm() {

    this.submit = true;
    this.spinner.show();
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const credentials = this.authForm.value;


    this.userService
      .attemptAuth(this.authType, credentials)
      .subscribe(
        data => {
         // console.log(data); 
          this.spinner.hide();
           this.router.navigateByUrl('/dashboard/welcome')
        //  this.router.navigateByUrl('/profile')

        },
        err => {
          this.errors = err;
        //  console.log(err);
         // var msg = err.non_field_errors[0];
          this.spinner.hide();

          this.message = err;
          this.alerts.push({
            type: 'danger',
            msg: err.error_message,
            timeout: 5000
          });
          this.isSubmitting = false;
        }
      );
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  redirect() {
    this.router.navigateByUrl('/signup');

  }
}
