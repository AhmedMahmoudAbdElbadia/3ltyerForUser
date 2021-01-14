import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PharmacyorderdetailsPageRoutingModule } from './pharmacyorderdetails-routing.module';

import { PharmacyorderdetailsPage } from './pharmacyorderdetails.page';
import { SharedModule } from '../directives/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PharmacyorderdetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [PharmacyorderdetailsPage]
})
export class PharmacyorderdetailsPageModule {}
