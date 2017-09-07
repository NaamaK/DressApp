import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { OutfitPage } from '../outfit/outfit';

@IonicPage()
@Component({
    selector: 'page-matching-outfits',
    templateUrl: 'matching-outfits.html',
})
export class MatchingOutfitsPage {

	itemId: number;
	outfits: any;

    isLoaded: boolean;
    error: any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private sharedData: SharedDataProvider) {
  	  this.isLoaded = false;
    }

  	ionViewDidLoad() {
  		this.itemId = this.navParams.data.itemId;
  		this.loadMatchingOutfits();
  	}

  	loadMatchingOutfits() {
  		var headers = new Headers();
  		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
  		let options = new RequestOptions({ headers: headers });

  		this.http.post('http://www.dressapp.org/serverSide/matchingOutfits.php', 'item_id=' + this.itemId , options).map(res => res.json()).subscribe(data => {
  			this.outfits = data;
        this.isLoaded = true;
  		}, error => {
  			this.error = error;
  		});
  	}

    loadOutfit(outfitId: number) {
        this.navCtrl.push(OutfitPage, { outfitId: outfitId });
    }

}
