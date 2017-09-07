import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StylistPage } from './stylist';

@NgModule({
  declarations: [
    StylistPage,
  ],
  imports: [
    IonicPageModule.forChild(StylistPage),
  ],
  exports: [
    StylistPage
  ]
})
export class StylistPageModule {}
