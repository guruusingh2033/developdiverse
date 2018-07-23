import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { AuthGuard } from '../core';
import { SharedModule } from '../shared';
import { ProfileRoutingModule } from './profile-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    NgxSpinnerModule
  ],
  declarations: [
    ProfileComponent
  ]
})
export class ProfileModule {}
