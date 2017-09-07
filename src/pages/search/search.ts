import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data'
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { OutfitPage } from '../outfit/outfit';
import { StylistPage } from '../stylist/stylist';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
	@ViewChild(Content) content: Content;
    @ViewChild('pageSlider') pageSlider: Slides;

	outfits: any;
    limit: number;
    offset: number;
	category: string;
    categories: string[] = [
        "None",
        "Casual",
        "Winter",
        "Fall",
        "Summer",
        "Spring",
        "Daytime",
        "Evening",
        "Sport",
        "Work",
        "Holiday",
        "Formal"
    ];
    tab: any;
    stylists: any;
    data: any;

    isOutfitsLoaded: boolean;
    isStylistsLoaded: boolean;
    error: any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private sharedData: SharedDataProvider) {
  		this.category = "None";
        this.isOutfitsLoaded = false;
        this.isStylistsLoaded = false;
        this.offset = 0;
        this.limit = 5;
        this.tab = '0';
        this.getAllStylists();
  	}

  	ionViewWillEnter() {
        this.offset = 0;
        this.loadOutfits();
        this.getAllStylists();
        this.content.scrollToTop();
    }

    ionSelected() {
      this.tab = '0';
      this.content.scrollToTop();
    }

    changeWillSlide($event) {
        this.tab = $event._snapIndex.toString();
    }

    selectTab(index) {
        this.pageSlider.slideTo(index);
    }

    loadOutfits() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
        let options = new RequestOptions({ headers: headers });

        this.http.get('http://www.dressapp.org/serverSide/outfits.php', options).map(res => res.json()).subscribe(data => {
          this.outfits = data;
          this.isOutfitsLoaded = true;
        }, error => {
          this.error = error;
        });
    }

    loadOutfit(outfitId: number) {
        this.navCtrl.push(OutfitPage, { outfitId: outfitId });
    }

    loadCategory() {
        this.offset = 0;
        if (this.category == "None") this.loadOutfits();
        else {
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
            let options = new RequestOptions({ headers: headers });

            this.http.post('http://www.dressapp.org/serverSide/outfits.php', 'category=' + this.category , options).map(res => res.json()).subscribe(data => {
                this.outfits = data;
            }, error => {
                this.error = error;
            });
        }
        this.content.scrollToTop();        
    }

    loadMore() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
        let options = new RequestOptions({ headers: headers });
        this.offset += this.limit;

        var query = (this.category == "None") ? 'offset=' + this.offset : 'category=' + this.category + '&offset=' + this.offset;

        this.http.post('http://www.dressapp.org/serverSide/outfits.php', query , options).map(res => res.json()).subscribe(data => {
            if (data.length < this.limit) {
                if (data.length != 0) this.outfits = this.outfits.concat(data); 
            }          
            else this.outfits = this.outfits.concat(data);
            this.isOutfitsLoaded = true;
        }, error => {
            this.error = error;
        });
    }

    getAllStylists() {
        var headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
          let options = new RequestOptions({ headers: headers });

          this.http.get('http://www.dressapp.org/serverSide/stylist.php', options).map(res => res.json()).subscribe(data => {
              this.data = data;
              this.stylists = data;
              this.isStylistsLoaded = true;
          }, error => {
              this.error = error;
          });
    }

    initializeStylists() {
        this.stylists = this.data;
    }

    getStylists(ev) {
        // Reset items back to all of the items
        this.initializeStylists();

        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
          this.stylists = this.stylists.filter((item) => {
            return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
    }

    navigateToStylist(stylistId: number) {
      this.navCtrl.push(StylistPage, { stylist: stylistId });
    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
          this.loadMore();
          infiniteScroll.complete();

        }, 500);
    }

}
