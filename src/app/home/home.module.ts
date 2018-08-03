import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared';
import { HomeRoutingModule } from './home-routing.module';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    NgxEditorModule,
    FormsModule,
    AlertModule.forRoot(),
    NgxSpinnerModule,
    TypeaheadModule.forRoot()

  ],
  declarations: [
    HomeComponent
  ],
  providers: [
  ]
})
export class HomeModule {}
