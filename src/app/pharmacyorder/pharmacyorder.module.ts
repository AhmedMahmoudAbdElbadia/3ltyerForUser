import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PharmacyorderPageRoutingModule } from './pharmacyorder-routing.module';

import { PharmacyorderPage } from './pharmacyorder.page';
import { SharedModule } from '../directives/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PharmacyorderPageRoutingModule,
    SharedModule
  ],
  declarations: [PharmacyorderPage]
})
export class PharmacyorderPageModule {}
