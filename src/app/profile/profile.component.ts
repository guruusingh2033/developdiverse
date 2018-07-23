import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User, UserService,ProfilesService } from '../core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {} as User;
  profileForm: FormGroup;
  profileForm2:FormGroup;
  errors: Object = {};
  isSubmitting = false;
  submit = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private profileService:ProfilesService
  ) {
    // create form group using the form builder
    this.profileForm = this.fb.group({
      'username':  ['', Validators.required],
      'surname':'',
      'email': ['', Validators.required],
      'userPosition':'',
      'company': ['', Validators.required],
      'department':'',
      'group':'',
      'phone':'',
      'address':'',
      'postcode':'',
      'city':'',
      'country':'',   
    });

    this.profileForm2 = this.fb.group({
      'oldPassword': ['', Validators.required],
      'newPassword':['', Validators.required],
    });
    // Optional: subscribe to changes on the form
    // this.profileForm.valueChanges.subscribe(values => this.updateUser(values));
  }

  ngOnInit() {
    // Make a fresh copy of the current user's object to place in editable form fields
    // Object.assign(this.user, this.userService.getCurrentUser());
    // Fill the form
    // this.profileForm.patchValue(this.user);
    
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }

  get f() { return this.profileForm.controls; }
  get f2() { return this.profileForm2.controls; }

  submitForm() {
    // this.isSubmitting = true;

    // // update the model
    // this.updateUser(this.profileForm.value);

    // this.userService
    // .update(this.user)
    // .subscribe(
    //   updatedUser => this.router.navigateByUrl('/profile/' + updatedUser.username),
    //   err => {
    //     this.errors = err;
    //     this.isSubmitting = false;
    //   }
    // );
  }

  updateUser(values: Object) {
    Object.assign(this.user, values);
  }

}
