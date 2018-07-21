import { Input, Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SlideOutSidebarComponent } from '../slide-out-sidebar/slide-out-sidebar.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  fiatList:any;
  chartTypeDict:any;
  timeSelectDict:any;

  selectedCoin:any;
  coins:any;

  selectedFiat:any;
  selectedChartType:any;
  selectedTimeUnit:any;

  objectKeys = Object.keys;

  @Input() slideOutSideBar: SlideOutSidebarComponent;

  @Input() home: HomeComponent;

  constructor(private _data : DataService) { }

  ngOnInit() {
  	this.fiatList = this._data.fiatList;
    this.chartTypeDict = this._data.chartTypeDict;
    this.timeSelectDict = this._data.timeSelectDict;

    this._data.selectedCoin.subscribe(res => this.selectedCoin = res);
    this._data.coins.subscribe(res => this.coins = res['RAW']);

    this._data.selectedFiat.subscribe(res => this.selectedFiat = res);
    this._data.selectedChartType.subscribe(res => this.selectedChartType = res);
    this._data.selectedTimeUnit.subscribe(res => this.selectedTimeUnit = res);
  }

  toggleSlide() {
    this.slideOutSideBar.toggleSlide();
  }

  toggleRemoveButtons(){
    this.home.toggleRemoveButtons();
  }

  selectTimeUnit(val) {
    this._data.selectTimeUnit(val);
  }

  selectChartType(val) {
    this._data.selectChartType(val);
  }

  selectFiat(val) {
    this._data.selectFiat(val);
  }

  specialRound(val){
    if(val == 0)
      return 0;
    var ext = ['','K','M','B','T'];
    for(var i = 0; i < ext.length; i++){
      var div = 10 ** (i*3);
      if(val >= div && val < div * 1000)
        return Math.round(val / (div/10)) / 10 + ext[i];
    }
    return "NaN";
  }

  properRound(val, maxPlaces?, decPlaces?, minNonZero?) {
    decPlaces = decPlaces ? decPlaces : 2;
    minNonZero = minNonZero ? minNonZero : 2;
    maxPlaces = maxPlaces ? maxPlaces : 6;
    var mult = 10 ** decPlaces;
    for(var i = 0; val < 10 ** (-i) && i < maxPlaces; i++)
      mult = 10 ** Math.min(maxPlaces, (i + minNonZero));
    return Math.round(val * mult) / mult;
  }

}
