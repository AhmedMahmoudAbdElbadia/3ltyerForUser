import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PharmacyorderPage } from './pharmacyorder.page';

const routes: Routes = [
  {
    path: '',
    component: PharmacyorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyorderPageRoutingModule {}
