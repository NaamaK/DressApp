import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';

import { ScanPage } from '../pages/scan/scan';
import { ClosetPage } from '../pages/closet/closet';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { SearchPage } from '../pages/search/search';
import { MatchingOutfitsPage } from '../pages/matching-outfits/matching-outfits';
import { LikedOutfitsPage } from '../pages/liked-outfits/liked-outfits';
import { OutfitPage } from '../pages/outfit/outfit';
import { ItemPage } from '../pages/item/item';
import { StylistPage } from '../pages/stylist/stylist';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { AboutPage } from '../pages/about/about';
import { ErrorPage } from '../pages/error/error';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpModule } from '@angular/http'
import { SharedDataProvider } from '../providers/shared-data/shared-data';

@NgModule({
  declarations: [
    MyApp,
    ScanPage,
    ClosetPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    SearchPage,
    MatchingOutfitsPage,
    LikedOutfitsPage,
    OutfitPage,
    ItemPage,
    StylistPage,
    AboutPage,
    TutorialPage,
    ErrorPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ScanPage,
    ClosetPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    SearchPage,
    MatchingOutfitsPage,
    LikedOutfitsPage,
    OutfitPage,
    ItemPage,
    StylistPage,
    AboutPage,
    TutorialPage,
    ErrorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SharedDataProvider,
    NativeStorage,
    Facebook
  ]
})
export class AppModule {}
