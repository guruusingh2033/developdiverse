import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeAuthResolver } from './home-auth-resolver.service';
import { SharedModule } from '../shared';
import { HomeRoutingModule } from './home-routing.module';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
 
@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    NgxEditorModule,
    FormsModule 
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    HomeAuthResolver
  ]
})
export class HomeModule {}
