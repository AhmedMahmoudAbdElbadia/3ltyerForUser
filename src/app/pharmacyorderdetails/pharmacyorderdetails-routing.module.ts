import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PharmacyorderdetailsPage } from './pharmacyorderdetails.page';

const routes: Routes = [
  {
    path: '',
    component: PharmacyorderdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyorderdetailsPageRoutingModule {}
