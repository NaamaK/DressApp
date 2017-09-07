import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
})
export class ErrorPage {

	error: any;

	isLoaded: boolean;

  	constructor(public navCtrl: NavController, public navParams: NavParams) {
  		this.isLoaded = false;
  	}

  	ionViewWillEnter() {
    	this.error = this.navParams.data.exception;
    	this.isLoaded = true;
    	console.log(this.error);
  	}

}
