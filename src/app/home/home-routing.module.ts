import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeAuthResolver } from './home-auth-resolver.service';
import { AuthGuard } from '../core';

const routes: Routes = [
  {
    path: 'dashboard/:id',
    component: HomeComponent,
    canActivate: [AuthGuard],

    resolve: {
      isAuthenticated: HomeAuthResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
