import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { User, UserService,Profile,ProfilesService } from '../core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {} as User;
  profile:any;
  profileForm: FormGroup;
  profileForm2:FormGroup;
  errors: Object = {};
  isSubmitting = false;
  submit = false;
  alerts: any;
  alert1:any;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private profileService:ProfilesService,
   private spinner: NgxSpinnerService,

  ) {
    // create form group using the form builder
    this.profileForm = this.fb.group({
      'username':  ['', Validators.required],
      'email': ['', Validators.required],
      'company': ['', Validators.required],
     
    });

    this.profileForm2 = this.fb.group({
      'oldPassword': ['', Validators.required],
      'newPassword':['', [Validators.required,Validators.pattern('^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$')]],
      'confirmPassword':  ['',[ Validators.required,confirmPassword]]

    });
    // Optional: subscribe to changes on the form
    // this.profileForm.valueChanges.subscribe(values => this.updateUser(values));
  }

  ngOnInit() {
    // Make a fresh copy of the current user's object to place in editable form fields
    //  Object.assign(this.profile, this.profileService.get());
    // Fill the form
    // this.profileForm.patchValue(this.profile);
    this.profileService
    .get()
    .subscribe(
      getUser =>{   
        this.profileForm.patchValue({
        'username':getUser.name,
        'email': getUser.email,
       'company':getUser.company,
     })
    },
      err => {
        this.errors = err;
        this.isSubmitting = false;
      }
  )
  this.alerts = [];
  this.alert1 = [];
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }

  get f() { return this.profileForm.controls; }
  get f2() { return this.profileForm2.controls; }

  submitForm() {
    this.isSubmitting = true;
    this.spinner.show();

    // update the model
    var updateForm  = {company:this.profileForm.value.company,name:this.profileForm.value.username};
  //  this.updateUser(updateForm);

    this.profileService
    .update(updateForm)
    .subscribe(
      updatedUser =>       {
      this.isSubmitting = false;
      this.spinner.hide();
      this.alerts.push({
        type: 'success',
        msg: 'Successfully Updated',
        timeout: 3000
      }); 
      this.router.navigateByUrl('/profile')},
      err => {
        this.spinner.hide();
        if(typeof(err) == "object")
        {         
         this.errors = err.error_message;
        }
        else{
          this.errors = err;

        }
        this.alerts.push({
          type: 'danger',
          msg: this.errors,
          timeout: 3000
        });
        this.isSubmitting = false;
      }
    );
    
  }


  changePassword(){
    this.isSubmitting = true;
    this.spinner.show();

    // update the model
    var updatePassForm  = {email:this.profileForm.value.email,old_password:this.profileForm2.value.oldPassword,new_password:this.profileForm2.value.newPassword};
  //  this.updateUser(updateForm);

    this.profileService
    .updatePassword(updatePassForm)
    .subscribe(
      updatedUser =>       {
      this.isSubmitting = false;
      this.spinner.hide();
      this.alert1.push({
        type: 'success',
        msg: updatedUser.message,
        timeout: 3000
      }); 
      this.router.navigateByUrl('/profile')},
      err => {
        if(typeof(err) == "object")
        {         
         this.errors = err.error_message;
        }
        else{
          this.errors = err;

        }
        this.alert1.push({
          type: 'danger',
          msg: this.errors,
          timeout: 3000
        });
        this.spinner.hide();

        this.isSubmitting = false;
      }
    );
  }

  updateUser(values: Object) {
    Object.assign(this.user, values);
  }


  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }



}
function confirmPassword(control: AbstractControl) {
  if (!control.parent || !control) {
    return;
  }
  const password = control.parent.get('newPassword');
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