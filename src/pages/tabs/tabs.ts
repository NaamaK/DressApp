import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SearchPage } from '../search/search';
import { ScanPage } from '../scan/scan';
import { LikedOutfitsPage } from '../liked-outfits/liked-outfits';
import { ClosetPage } from '../closet/closet';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  	tab1Root = HomePage;
  	tab2Root = SearchPage;
  	tab3Root = ScanPage;
  	tab4Root = LikedOutfitsPage;
  	tab5Root = ClosetPage;

  	constructor() {

  	}
}
