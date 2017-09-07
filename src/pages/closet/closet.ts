import { Component, ViewChild } from '@angular/core';
import { NavController, App, Content, Platform, ActionSheetController, Slides } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { LikedOutfitsPage } from '../liked-outfits/liked-outfits';
import { LoginPage } from '../login/login';
import { ItemPage } from '../item/item';
import { StylistPage } from '../stylist/stylist';
import { TutorialPage } from '../tutorial/tutorial';
import { AboutPage } from '../about/about';

@Component({
  	selector: 'page-closet',
  	templateUrl: 'closet.html'
})
export class ClosetPage {
    @ViewChild(Content) content: Content;
    @ViewChild('pageSlider') pageSlider: Slides;
    
    user: any;
    userReady: boolean = false;
	  myItems:any;
	  tab: string;
    noItems: boolean;
    stylists: any;

    isItemsLoaded:boolean;
    isStylistsLoaded:boolean;
    error: any;

  	constructor(public navCtrl: NavController, public http: Http, private sharedData: SharedDataProvider, private app: App, public platform: Platform, public actionsheetCtrl: ActionSheetController, public fb: Facebook, public nativeStorage: NativeStorage) {
  		this.myItems = null;
      this.noItems = false;
      this.tab = '0';
      this.isItemsLoaded = false;
      this.isStylistsLoaded = false;
  		// this.isLoggedIn = this.sharedData.isLoggedIn();
  	}

    ionSelected() {
      this.tab = '0';
      this.content.scrollToTop();
    }

  	ionViewWillEnter() {
      let env = this;
      this.nativeStorage.getItem('user')
      .then(function (data){
        env.user = {
          name: data.name,
          gender: data.gender,
          picture: data.picture
        };
          env.userReady = true;
      }, function(error){
        console.log(error);
      });
	    this.getAllItems();
      this.getFollowing();
	  }

    changeWillSlide($event) {
        this.tab = $event._snapIndex.toString();
    }

    selectTab(index) {
        this.pageSlider.slideTo(index);
    }

  	getUserName() {
  		if(this.sharedData.isLoggedIn()) return this.sharedData.getUsername();
  		return "no user logged in";
  	}

  	getAllItems() {
      this.noItems = false;
  		var headers = new Headers();
  		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
  		let options = new RequestOptions({ headers: headers });

  		this.http.post('http://www.dressapp.org/serverSide/closet.php', 'user_id='+this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
  			if (Object.keys(data).length == 1 && data.items == "none") this.noItems = true;
        else this.myItems = data;
        this.isItemsLoaded = true;
  		}, error => {
  			this.error = error;
  		});
  	}

    getFollowing() {
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
      let options = new RequestOptions({ headers: headers });

      this.http.post('http://www.dressapp.org/serverSide/stylist.php', 'user_id='+this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
          this.stylists = data;
          this.isStylistsLoaded = true;
      }, error => {
          this.error = error;
      });
    }

    unfollow(stylistId: number) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
        let options = new RequestOptions({ headers: headers });

        this.http.post('http://www.dressapp.org/serverSide/stylist.php', 'unfollow=' + stylistId + '&user_id=' + this.sharedData.getUserId() , options).map(res => res.json()).subscribe(data => {
     
        }, error => {
            this.error = error;
        });
    }

    loadLikedOutfits() {
      this.navCtrl.push(LikedOutfitsPage);
    }

    navigateToStylist(stylistId: number) {
      this.navCtrl.push(StylistPage, { stylist: stylistId });
    }

    logout() {
      this.sharedData.logout();
      var nav = this.navCtrl;
      let env = this;
      this.fb.logout()
      .then(function(response) {
        //user logged out so we will remove him from the NativeStorage
        env.nativeStorage.remove('user');
        nav.push(LoginPage);
      }, function(error){
        console.log(error);
      });
      this.app.getRootNav().push(LoginPage);
    }

    about() {
      this.app.getRootNav().push(AboutPage);
    }

    tutorial() {
      this.navCtrl.push(TutorialPage);
    }

    loadItem(itemId: number) {
      this.navCtrl.push(ItemPage, { itemId: itemId });
    }

    scan() {
      this.app.getRootNav().getActiveChildNav().select(2);
    }

    openMenu() {
      let actionSheet = this.actionsheetCtrl.create({
      title: 'Options',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Logout',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'log-out' : null,
          handler: () => {
            this.logout();
          }
        },
        {
          text: 'Share',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
          }
        },
        // {
        //   text: 'Tutorial',
        //   icon: !this.platform.is('ios') ? 'help-circle' : null,
        //   handler: () => {
        //     this.tutorial();
        //   }
        // },
        {
          text: 'About',
          icon: !this.platform.is('ios') ? 'information' : null,
          handler: () => {
            this.about();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }
}
