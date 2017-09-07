import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	email: string;
	username: string;
	password: string;
	confirmPassword: string;

	loading: any;
	hasError: boolean;
	registerSucceed: boolean;
	message: string;
	error: any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
  		this.hasError = false;
  		this.registerSucceed = false;
  	}

  	ionViewDidLoad() {
  	}

  	register() {
  		this.hasError = false;
  		this.loading = this.presentLoading();
  		if (this.password != this.confirmPassword) {
  			this.hasError = true;
  			this.message = "password and confirmed password do not match";
  			this.loading.dismiss();
  		}
  		else {
			var headers = new Headers();
			headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
			let options = new RequestOptions({ headers: headers });

			this.http.post('http://www.dressapp.org/serverSide/register.php', 'email='+this.email.toLowerCase() + '&password='+this.password + '&username='+this.username , options).map(res => res.json()).subscribe(data => {
				if (Object.keys(data).length == 2 && data.hasOwnProperty('status')) {
					if (data.status == 'Success') {
						if (data.message != "created") this.message = data.message;
						else this.message = "created!!";
						this.registerSucceed = true;
					} 
					else if (data.status == 'Failed') {
						this.hasError = true;
						this.message = data.message;
					}
				}
				this.loading.dismiss();
			}, error => {
				this.error = error;
				this.loading.dismiss();
			});
  		}
  	}

  	login() {
  		this.navCtrl.push(LoginPage);
  	}

  	presentLoading() {
	    let loader = this.loadingCtrl.create({
	      content: "Please wait...",
	    });
	    loader.present();
	    return loader;
	}

}
