import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardAuthResolver } from './dashboard-auth-resolver.service';
import { AuthGuard } from '../core';

const routes: Routes = [
  {
    path: 'dash',
    component: DashboardComponent,
    canActivate: [AuthGuard],

    resolve: {
      isAuthenticated: DashboardAuthResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
