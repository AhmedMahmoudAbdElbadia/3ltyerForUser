import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryHomePage } from './category-home.page';
import { UserGuard } from 'src/app/UserGuard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CategoryHomePage,
    canActivate: [UserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryHomePageRoutingModule { }
