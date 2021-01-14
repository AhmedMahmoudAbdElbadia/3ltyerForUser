import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryHomePageRoutingModule } from './category-home-routing.module';

import { CategoryHomePage } from './category-home.page';
import { SharedModule } from 'src/app/directives/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryHomePageRoutingModule,
    SharedModule
  ],
  declarations: [CategoryHomePage]
})
export class CategoryHomePageModule { }
