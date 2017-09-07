import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LikedOutfitsPage } from './liked-outfits';

@NgModule({
  declarations: [
    LikedOutfitsPage,
  ],
  imports: [
    IonicPageModule.forChild(LikedOutfitsPage),
  ],
  exports: [
    LikedOutfitsPage
  ]
})
export class LikedOutfitsPageModule {}
