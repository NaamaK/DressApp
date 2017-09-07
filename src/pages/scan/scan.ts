import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { SharedDataProvider } from '../../providers/shared-data/shared-data'
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { ItemPage } from '../item/item';

@Component({
  	selector: 'page-scan',
  	templateUrl: 'scan.html'
})
export class ScanPage {

	name: string;
  	hasResult: boolean;
  	result: any;

  	loading: any;
  	hasMatchingOutfits:boolean;
  	isItemInCloset:boolean;

  	error: any;

  	constructor(public navCtrl: NavController, public http: Http, private sharedData: SharedDataProvider, public loadingCtrl: LoadingController) {
		this.hasResult = false;
		this.hasMatchingOutfits = false;
		this.isItemInCloset = false;
  	}

  	ionSelected() {
      this.hasResult = false;
    }

  	scan() {
		BarcodeScanner.scan()
			.then((result) => {
				if (!result.cancelled) {
					if(result.format == "QR_CODE") {
							var url = result.text;
							var productId = url.substring(url.indexOf("#qr") + 4, url.length -2);
							this.loading = this.presentLoading();
				  			this.postRequest(productId);
					}
				}
			})
			.catch((err) => {
				alert("Scanning failed: " + err);
				this.error = err;
			})
  	}

  	postRequest(param:string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
		let options = new RequestOptions({ headers: headers });

		this.http.post('http://www.dressapp.org/serverSide/item.php', 'qr_code='+param , options).map(res => res.json()).subscribe(data => {
			this.result = data;
			this.navCtrl.push(ItemPage, { itemId: data.item_id });
			this.hasResult = true;
			this.loading.dismiss();
		}, error => {
			this.loading.dismiss();
			this.error = error;
		});
  	}

  	presentLoading() {
	    let loader = this.loadingCtrl.create({
	      content: "Loading Item, Please wait...",
	    });
	    loader.present();
	    return loader;
	}

}
