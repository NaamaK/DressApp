import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchingOutfitsPage } from './matching-outfits';

@NgModule({
  declarations: [
    MatchingOutfitsPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchingOutfitsPage),
  ],
  exports: [
    MatchingOutfitsPage
  ]
})
export class MatchingOutfitsPageModule {}
