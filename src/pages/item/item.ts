import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { MatchingOutfitsPage } from '../matching-outfits/matching-outfits';

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
})
export class ItemPage {

	itemId: number;
	item: any;
	isLoaded: boolean;
	
	hasMatchingOutfits:boolean;
  	isItemInCloset:boolean;

  	error: any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private sharedData: SharedDataProvider) {
  		this.isLoaded = false;
  		this.hasMatchingOutfits = false;
  		this.isItemInCloset = false;
  	}

  	ionViewDidLoad() {
  		this.itemId = this.navParams.data.itemId;
    	this.loadItem();
  	}

  	loadItem() {
  		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
		let options = new RequestOptions({ headers: headers });

		this.http.post('http://www.dressapp.org/serverSide/item.php', 'item_id='+ this.itemId , options).map(res => res.json()).subscribe(data => {
			this.item = data;
			this.item.item_type= this.item.item_type.replace(/&amp;/gi, "&");
			this.checkMatchingOutfits();
			this.checkIfItemInCloset();
			this.isLoaded = true;
		}, error => {
			this.error = error;
		});
  	}

  	checkMatchingOutfits() {
  		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
		let options = new RequestOptions({ headers: headers });

		this.http.post('http://www.dressapp.org/serverSide/matchingOutfits.php', 'item_id=' + this.itemId , options).map(res => res.json()).subscribe(data => {
			if (data.length > 0) this.hasMatchingOutfits = true;
		}, error => {
			this.error = error;
		});
  	}

  	findMatchingOutfits() {
  		this.navCtrl.push(MatchingOutfitsPage, { itemId: this.itemId });
  	}

  	checkIfItemInCloset() {
  		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
		let options = new RequestOptions({ headers: headers });

		this.http.post('http://www.dressapp.org/serverSide/closet.php', 'checkItemInCloset=' + this.itemId + '&user_id=' + this.sharedData.getUserId(), options).map(res => res.json()).subscribe(data => {
			if (data.isInCloset == "yes") this.isItemInCloset = true;
		}, error => {
			this.error = error;
		});
  	}

  	addItemToCloset() {
  		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
		let options = new RequestOptions({ headers: headers });

		this.http.post('http://www.dressapp.org/serverSide/closet.php', 'addItemToCloset=' + this.itemId + '&user_id=' + this.sharedData.getUserId(), options).map(res => res.json()).subscribe(data => {
			this.isItemInCloset = true;
		}, error => {
			this.error = error;
		});
  	}

  	removeItemFromCloset() {
  		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
		let options = new RequestOptions({ headers: headers });

		this.http.post('http://www.dressapp.org/serverSide/closet.php', 'removeItem=' + this.itemId + '&user_id=' + this.sharedData.getUserId(), options).map(res => res.json()).subscribe(data => {
			this.isItemInCloset = false;
		}, error => {
			this.error = error;
		});
  	}
}
