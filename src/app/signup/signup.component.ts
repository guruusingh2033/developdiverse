import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';

import { Errors, UserService } from '../core';

@Component({
  selector: 'app-auth-page',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  authType: String = '';
  title: String = '';
  errors: Errors = {errors: {}};
  isSubmitting = false;
  authForm: FormGroup;
  submit:boolean=false;
  alerts: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService

  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required,Validators.email]],
      'password': ['', Validators.required],
      'company': ['', Validators.required],
      'confirmPassword':  ['',[ Validators.required,this.confirmPassword]]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either passwordsNotMatch'login' or 'register')
      this.authType ='signup';
      // Set a title for the page accordingly
      this.title =  'Sign up';
    });
    this.alerts =[];
  }
    // convenience getter for easy access to form fields
    get f() { return this.authForm.controls; }

  submitForm() {
    this.submit = true;
    this.spinner.show();

   // stop here if form is invalid
    if (this.authForm.invalid) {
        return;
    }
    this.isSubmitting = true;

    this.errors = {errors: {}};

    const credentials = this.authForm.value;
    delete credentials.confirmPassword;
    this.userService
    .attemptAuth(this.authType, credentials)
    .subscribe(
      data =>{ console.log(data); 
        this.spinner.hide();

        this.router.navigateByUrl('/')
       },
      err => {
        console.log(err);
        this.errors = err;
        var msg = err;
       this.alerts.push({
        type: 'danger',
        msg: msg,
        timeout: 5000
      });
      this.spinner.hide();

        this.isSubmitting = false;
      }
    );
  }



  confirmPassword(control: AbstractControl) {
    if (!control.parent || !control) {
      return;
    }
    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('confirmPassword');
  
    if (!password || !passwordConfirm) {
      return;
    }
  
    if (passwordConfirm.value === '') {
      return;
    }
  
    if (password.value !== passwordConfirm.value) {
      return {
        passwordsNotMatch: true
      };
    }
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
