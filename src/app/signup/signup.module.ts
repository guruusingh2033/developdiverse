import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SignupComponent } from './signup.component';
import { AuthGuard } from '../core';
import { SharedModule } from '../shared';
import { SignupRoutingModule } from './signup-routing.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    SharedModule,
    SignupRoutingModule,
    AlertModule.forRoot(),
    NgxSpinnerModule
  ],
  declarations: [
    SignupComponent
  ]
})
export class SignupModule {}
