import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, App } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import 'rxjs/add/operator/map';

import { OutfitPage } from '../outfit/outfit';

@IonicPage()
@Component({
  selector: 'page-liked-outfits',
  templateUrl: 'liked-outfits.html',
})
export class LikedOutfitsPage {
    @ViewChild(Content) content: Content;

    outfits: any;
    isLoaded: boolean;
    noOutfits: boolean;

    error: any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private sharedData: SharedDataProvider, private app: App) {
  	    this.isLoaded = false;
        this.noOutfits = false; 
    }

  	ionViewWillEnter() {
  		this.loadLikedOutfits();
  	}

    ionSelected() {
        this.content.scrollToTop();
    }

  	loadLikedOutfits() {
        this.noOutfits = false;
  		var headers = new Headers();
  		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
  		let options = new RequestOptions({ headers: headers });

  		this.http.post('http://www.dressapp.org/serverSide/likedOutfits.php', 'user_id=' + this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
  			if (Object.keys(data).length == 1 && data.outfits == "none") this.noOutfits = true;
            else this.outfits = data;
            this.isLoaded = true;
  		}, error => {
  			this.error = error;
  		});
  	}

    loadOutfit(outfitId: number) {
        this.navCtrl.push(OutfitPage, { outfitId: outfitId });
    }

    search() {
      this.app.getRootNav().getActiveChildNav().select(1);
    }
}
