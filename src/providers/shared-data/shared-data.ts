import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { ErrorPage } from '../../pages/error/error';

@Injectable()
export class SharedDataProvider {

	user:any;
  loading: any;

  	constructor(public http: Http, public loadingCtrl: LoadingController) {
    	this.user = null;
  	}

  	public setUser(userData:any){
  		this.user = userData;
  	}

  	public isLoggedIn() {
  		if (this.user == null) return false;
  		return true;
  	}

  	public updateUser() {
  		//need to update user from db
  	}

    public getUsername() {
      return this.user.username;
    }

    public getUserId() {
      // console.log(this.user);
      return this.user.user_id;
    }

    public logout() {
      this.user = null;
    }

    public throwException(navCtrl: any, error: any) {
      navCtrl.push(ErrorPage, { exception: error });
    }

    public presentLoading() {
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
      });
      loader.present();
      return loader;
  }
}
