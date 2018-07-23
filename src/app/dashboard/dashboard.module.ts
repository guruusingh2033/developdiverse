import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DashboardAuthResolver } from './dashboard-auth-resolver.service';
import { SharedModule } from '../shared';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
 
@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule,
    NgxEditorModule,
    FormsModule 
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    DashboardAuthResolver
  ]
})
export class DashboardModule {}
