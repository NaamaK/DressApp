import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { SharedDataProvider } from '../../providers/shared-data/shared-data'
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { TabsPage } from '../tabs/tabs';
import { TutorialPage } from '../tutorial/tutorial';
import { RegisterPage } from '../register/register';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	FB_APP_ID: number = 1045482048929474;

  	email: string;
	password: string;
	isLoggedIn: boolean;
	hasErrorLogin: boolean;
	user: any;

	loading: any;
	loginError: string;
	error: any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private sharedData: SharedDataProvider, public loadingCtrl: LoadingController,public fb: Facebook, public nativeStorage: NativeStorage) {
		this.isLoggedIn = false;
		this.hasErrorLogin = false;
		this.fb.browserInit(this.FB_APP_ID, "v2.8");
  	}

  	ionViewDidLoad() {
		this.isLoggedIn = this.sharedData.isLoggedIn();
	}

  	getUserName() {
  		if(this.sharedData.isLoggedIn()) return this.sharedData.getUsername();
  		return "no user logged in";
  	}

  	login() {
  		this.hasErrorLogin = false;
  		this.loading = this.presentLoading();
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
		let options = new RequestOptions({ headers: headers });

		this.http.post('http://www.dressapp.org/serverSide/login.php', 'email='+this.email.toLowerCase() + '&password='+this.password , options).map(res => res.json()).subscribe(data => {
			if (Object.keys(data).length == 2 && data.status == "Failed") {
				this.loginError = data.error;
				this.hasErrorLogin = true;
			} else {
				if (data.active == "0") {
					this.loginError = "Check your inbox and verify your account.";
					this.hasErrorLogin = true;
				}
				else {
					this.isLoggedIn = true;
					this.sharedData.setUser(data);
					this.user = data;
					let env = this;
					let nav = this.navCtrl;
					this.nativeStorage.setItem('user', //save the users info in the NativeStorage
			        {
			          name: env.user.username,
	          		  email: env.user.email,
	          		  data: env.user
			        })
			        .then(function(){
			        	if (data.is_first_time == 1) nav.push(TutorialPage);
						else nav.push(TabsPage);
			        }, function (error) {
			          console.log(error);
			        })
				}
			}
			this.loading.dismiss();
		}, error => {
			this.error = error;
			this.loading.dismiss();
		});
  	}

  	// remove this function later
  	mockLogin() {
  		this.hasErrorLogin = false;
  		this.loading = this.presentLoading();
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
		let options = new RequestOptions({ headers: headers });
		this.email = "try@gmail.com";
		this.password = "try";

		this.http.post('http://www.dressapp.org/serverSide/login.php', 'email='+this.email+ '&password='+this.password , options).map(res => res.json()).subscribe(data => {
			if (Object.keys(data).length == 2 && data.status == "Failed") {
				this.loginError = data.error;
				this.hasErrorLogin = true;
			} else {
				if (data.active == 0) {
					this.loginError = "Check your inbox and verify your account.";
					this.hasErrorLogin = true;
				}
				else {
					this.isLoggedIn = true;
					this.sharedData.setUser(data);
					this.user = data;
					if (data.is_first_time == 1) this.navCtrl.push(TutorialPage);
					else this.navCtrl.push(TabsPage);
				}
			}
			this.loading.dismiss();
		}, error => {
			this.error = error;
			this.loading.dismiss();
		});
  	}

  	loginFb(email:string, username:string) {
  		this.hasErrorLogin = false;
  		this.loading = this.presentLoading();
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
		let options = new RequestOptions({ headers: headers });

		this.http.post('http://www.dressapp.org/serverSide/continueViaFacebook.php', 'email='+email.toLowerCase() + '&username='+username , options).map(res => res.json()).subscribe(data => {
			if (Object.keys(data).length == 2 && data.status == "Failed") {
				this.loginError = data.error;
				this.hasErrorLogin = true;
			} else {
				this.isLoggedIn = true;
				this.sharedData.setUser(data);
				this.user = data;
				let env = this;
				let nav = this.navCtrl;
				this.nativeStorage.setItem('user', //save the users info in the NativeStorage
		        {
		          name: env.user.username,
		          email: env.user.email,
		          data: env.user
		        })
		        .then(function(){
		          if (data.is_first_time == 1) nav.push(TutorialPage);
				  else nav.push(TabsPage);
		        }, function (error) {
		          console.log(error);
		        })
				
			}
			this.loading.dismiss();
		}, error => {
			this.error = error;
			this.loading.dismiss();
		});
  	}

  	tutorial() {
  		this.navCtrl.push(TutorialPage);
  	}

  	register() {
  		this.navCtrl.push(RegisterPage);
  	}

  	presentLoading() {
	    let loader = this.loadingCtrl.create({
	      content: "Please wait...",
	    });
	    loader.present();
	    return loader;
	}

	throwException(err: string) {
		this.sharedData.throwException(this.navCtrl, err);
	}

 	doFbLogin(){
	    let permissions = new Array<string>();
		let env = this;
	    //the permissions your facebook app needs from the user
	    permissions = ["public_profile","email"];


	    this.fb.login(permissions)
	    .then(function(response){
	      let userId = response.authResponse.userID;
	      let params = new Array<string>();

	      //Getting name and gender properties
	      env.fb.api("/me?fields=id,email,gender,name", params)
	      .then(function(user) {
	        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
	        //now we have the users info, let's save it in the NativeStorage
	        env.loginFb(user.email, user.name);
	      })
	    }, function(error){
	      console.log(error);
	    });
	}
}
