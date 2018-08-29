import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FaqComponent } from './faq.component';
import { AuthGuard } from '../core';
import { SharedModule } from '../shared';
import { FaqRoutingModule } from './faq-routing.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule,MatFormFieldModule, MatInputModule,MatRippleModule,
} from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    FaqRoutingModule,
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    
  ],
  declarations: [
    FaqComponent
  ]
})
export class FaqModule {}
