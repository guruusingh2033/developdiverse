import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';

import { JoblistComponent } from './joblist.component';
import { AuthGuard } from '../core';
import { SharedModule } from '../shared';
import { JoblistRoutingModule } from './joblist-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    SharedModule,
    JoblistRoutingModule,
    NgxSpinnerModule,
    AlertModule.forRoot(),
    NgxPaginationModule,
    Ng2SearchPipeModule

  ],
  declarations: [
    JoblistComponent
  ]
})
export class JoblistModule {}
