import { Component, ViewChild } from '@angular/core';
import { NavController, Content, App } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { OutfitPage } from '../outfit/outfit';

@Component({
  	selector: 'page-home',
  	templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild(Content) content: Content;

    outfits: any;
    isLoaded: boolean;
    limit: number;
    offset: number;
    noOutfits: boolean;
    // tabs: string;

    error: any;

  	constructor(public navCtrl: NavController, public http: Http, private sharedData: SharedDataProvider, private app: App, public nativeStorage: NativeStorage/*, public loadingCtrl: LoadingController*/) {
		this.isLoaded = false;
        this.offset = 0;
        this.limit = 5;
        this.noOutfits = false;
        let env = this;
        this.nativeStorage.getItem('user').then( function (data) {
          env.sharedData.setUser(data.data);
          console.log(data);
        });
        // this.tabs = "following";
        // this.nothingToLoad = false;
  	}

    ionViewWillEnter() {
        this.offset = 0;
        this.loadOutfits();
        this.content.scrollToTop();
        this.navCtrl.popToRoot();
        // this.app.getRootNav().getActiveChildNav().getSelected().popToRoot();
    }

    ionSelected() {
      this.content.scrollToTop();
    }
  	
    getUserName() {
  		if(this.sharedData.isLoggedIn()) return this.sharedData.getUsername();
  		return "no user logged in";
  	}

    loadOutfits() {
        this.noOutfits = false;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
        let options = new RequestOptions({ headers: headers });

        this.http.post('http://www.dressapp.org/serverSide/outfits.php',  'user_id=' + this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
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

    loadMore() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
        let options = new RequestOptions({ headers: headers });
        this.offset += this.limit;

        this.http.post('http://www.dressapp.org/serverSide/outfits.php', 'offset=' + this.offset + '&user_id=' + this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
            if (data.length < this.limit) {
                if (data.length != 0) this.outfits = this.outfits.concat(data); 
            }          
            else this.outfits = this.outfits.concat(data);
            this.isLoaded = true;
        }, error => {
            this.error = error;
        });
    }

    search() {
        this.app.getRootNav().getActiveChildNav().select(1);
    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
          this.loadMore();
          infiniteScroll.complete();

        }, 500);
    }

}