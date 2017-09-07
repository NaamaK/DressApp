import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data'
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { ItemPage } from '../item/item';
import { StylistPage } from '../stylist/stylist';

@IonicPage()
@Component({
  selector: 'page-outfit',
  templateUrl: 'outfit.html',
})
export class OutfitPage {

  	outfitId: number;
  	outfit: any;
  	isLoaded: boolean;
    isOutfitLiked: boolean;
    totalCost: number;

    error: any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private sharedData: SharedDataProvider, public toastCtrl: ToastController) {
  		this.isLoaded = false;
      this.isOutfitLiked = false;
  	}

  	ionViewWillLoad() {
    	this.outfitId = this.navParams.data.outfitId;
  		this.loadOutfit();
  	}

    ionViewWillEnter() {
      this.isOutfitLiked = false;
      this.checkIfOutfitLiked();
    }

  	loadOutfit() {
  		var headers = new Headers();
  		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
  		let options = new RequestOptions({ headers: headers });

  		this.http.post('http://www.dressapp.org/serverSide/outfit.php', 'outfit=' + this.outfitId + '&user_id=' + this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
  			this.outfit = data;
        this.outfit.items.forEach(function (item) {
          item.item_type= item.item_type.replace(/&amp;/gi, "&");
        })
        this.isOutfitLiked = data.isLiked;
        this.getTotalCost();
  			this.isLoaded = true;
  		}, error => {
  			this.error = error;
  		});
  	}

    likeOutfit() {
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
      let options = new RequestOptions({ headers: headers });

      this.http.post('http://www.dressapp.org/serverSide/outfit.php', 'likedOutfit=' + this.outfitId + '&user_id=' + this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
        this.isOutfitLiked = true;
        this.showToast("Outfit was successfully liked");
      }, error => {
        this.error = error;
      });
    }

    dislikeOutfit() {
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
      let options = new RequestOptions({ headers: headers });

      this.http.post('http://www.dressapp.org/serverSide/outfit.php', 'dislikedOutfit=' + this.outfitId + '&user_id=' + this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
        this.isOutfitLiked = false;
      }, error => {
        this.error = error;
      });
    }

    checkIfOutfitLiked() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
        let options = new RequestOptions({ headers: headers });

        this.http.post('http://www.dressapp.org/serverSide/outfit.php', 'checkOutfitLiked=' + this.outfitId + '&user_id=' + this.sharedData.getUserId(), options).map(res => res.json()).subscribe(data => {
            if (data.isOutfitLiked == "yes") this.isOutfitLiked = true;
            else this.isOutfitLiked = false;
        }, error => {
            this.error = error;
        });
    }

  	loadItem(itemId: number) {
  		this.navCtrl.push(ItemPage, { itemId: itemId });
  	}

    navigateToStylist() {
      this.navCtrl.push(StylistPage, { stylist: this.outfit.stylist.id });
    }

    getTotalCost() {
      var price = 0;
      this.outfit.items.forEach(function (item) {
        price += +item.price;
      })
      this.totalCost = +price.toFixed(2);
    }

    showToast(msg: string) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 2000,
        showCloseButton: true,
        closeButtonText: 'X'
      });
      toast.present();
    }

}
