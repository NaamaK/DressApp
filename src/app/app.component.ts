import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ViewController, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = TabsPage;
  @ViewChild(Nav) nav: Nav;

  // rootPage:any = LoginPage;
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private app: App, public nativeStorage: NativeStorage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      platform.registerBackButtonAction(() => {
        let nav = app.getActiveNav();
        let activeView: ViewController = nav.getActive();

        if(activeView != null){
          if(nav.canGoBack()) {
            nav.pop();
          }else if (typeof activeView.instance.backButtonAction === 'function')
            activeView.instance.backButtonAction();
          else nav.parent.select(0); // goes to the first tab
          // else navigator['app'].exitApp();
        }
      });

      // Here we will check if the user is already logged in
      // because we don't want to ask users to log in each time they open the app
      let env = this;
      this.nativeStorage.getItem('user').then( function (data) {
        // user is previously logged and we have his data
        // we will let him access the app
        env.nav.push(TabsPage);
      }, function (error) {
        //we don't have the user data so we will ask him to log in
        env.nav.push(LoginPage);
      });

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
