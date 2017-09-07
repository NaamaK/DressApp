import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data'
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { OutfitPage } from '../outfit/outfit';

@IonicPage()
@Component({
  selector: 'page-stylist',
  templateUrl: 'stylist.html',
})
export class StylistPage {

	stylistId: number;
	stylist: any;
	outfits: any;
	isLoaded: boolean;
	isFollowed: boolean;
    noOutfits: boolean;

	error: any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private sharedData: SharedDataProvider, public alertCtrl: AlertController) {
  	    this.isLoaded = false;
        this.noOutfits = false;
        this.isFollowed = false;
  	}

    ionViewWillLoad() {
        this.stylistId = this.navParams.data.stylist;
        this.loadStylist();
    }

    ionViewWillEnter() {
        this.isFollowed = false;
        this.checkIfFollowed();
    }

	loadStylist() {
		var headers = new Headers();
  		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
  		let options = new RequestOptions({ headers: headers });

  		this.http.post('http://www.dressapp.org/serverSide/stylist.php', 'stylistID=' + this.stylistId , options).map(res => res.json()).subscribe(data => {
  			this.stylist = data;
  			this.loadStylistOutfits();
  		}, error => {
  			this.error = error;
  		});
	}

	loadStylistOutfits() {
        this.noOutfits = false;
		var headers = new Headers();
  		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
  		let options = new RequestOptions({ headers: headers });

  		this.http.post('http://www.dressapp.org/serverSide/outfits.php', 'stylist=' + this.stylistId , options).map(res => res.json()).subscribe(data => {
  			if (Object.keys(data).length == 1 && data.outfits == "none") this.noOutfits = true;
            else this.outfits = data;
  			this.isLoaded = true;
  		}, error => {
  			this.error = error;
  		});
	}

	follow() {
		var headers = new Headers();
  		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
  		let options = new RequestOptions({ headers: headers });

  		this.http.post('http://www.dressapp.org/serverSide/stylist.php', 'follow=' + this.stylistId + '&user_id=' + this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
  			this.isFollowed = true;
  		}, error => {
  			this.error = error;
  		});
	}

    unfollow() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
        let options = new RequestOptions({ headers: headers });

        this.http.post('http://www.dressapp.org/serverSide/stylist.php', 'unfollow=' + this.stylistId + '&user_id=' + this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
            this.isFollowed = false;
        }, error => {
            this.error = error;
        });
    }

    checkIfFollowed() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
        let options = new RequestOptions({ headers: headers });

        this.http.post('http://www.dressapp.org/serverSide/stylist.php', 'checkIfFollowed=' + this.stylistId + '&user_id=' + this.sharedData.getUserId(), options).map(res => res.json()).subscribe(data => {
            if (data.isFollowed == "yes") this.isFollowed = true;
            else this.isFollowed = false;
        }, error => {
            this.error = error;
        });
    }

	back() {
		this.navCtrl.pop();
	}

	loadOutfit(outfitId: number) {
        this.navCtrl.push(OutfitPage, { outfitId: outfitId });
    }

    showAlert(info: string, email: string) {
      if (info == null) info = "-";
	    let alert = this.alertCtrl.create({
	      title: 'Information',
	      message: '<b>About:</b><br>' +
                 info + '<br><br>'+
                 '<b>Email:</b><br>' +
                 email,
	      buttons: ['OK']
	    });
	    alert.present();
	}

}
