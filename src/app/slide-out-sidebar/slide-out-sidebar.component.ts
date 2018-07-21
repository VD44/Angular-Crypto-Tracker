import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-slide-out-sidebar',
  templateUrl: './slide-out-sidebar.component.html',
  styleUrls: ['./slide-out-sidebar.component.css']
})
export class SlideOutSidebarComponent implements OnInit {

  rawCoins:any;
  allCoins:any;
  coinStringList = [];
  slideOpen = false;

  objectKeys = Object.keys;

  constructor(private _data : DataService) { }

  ngOnInit() {
  	this._data.allCoins.subscribe(res => this.allCoins = res);
    this._data.allCoins.subscribe(res => this.rawCoins = res);
    this._data.coinStringList.subscribe(res => this.coinStringList = res);
  }

   toggleSlide(){
    this.slideOpen = !this.slideOpen;
    document.getElementById("slide-out-header").style.height = $("#header").height() + "px";
    document.getElementById("slide-out-main").style.marginTop = $("#header").outerHeight() + "px";
    document.getElementById("slide-out-side-bar").style.width = this.slideOpen ? "250px" : "0";
  }

  addCoin(coin){
    this._data.addCoin(coin);
  }

  searchCoins(event: any) {
    let val = event.target.value;
    this.allCoins = this.rawCoins;
    if (val && val.trim() != '') {
      const filtered = Object.keys(this.allCoins).sort()
        .filter(key => key.toUpperCase().includes(val.toUpperCase()))
        .reduce((obj,key) => {
          obj[key] = this.allCoins[key];
          return obj;
        }, {});
      this.allCoins = filtered;
    }
  }

}
