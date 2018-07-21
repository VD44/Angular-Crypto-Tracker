import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PersistenceService, StorageType } from 'angular-persistence';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  result:any;
  updateInterval = 800;
  defaultCoins = ["BTC", "ETH", "LTC"];

  fiatList = ["USD", "AUD", "CAD", "CHF", "EUR", "GBP", "JPY", "NZD"];
  chartTypeDict = {
    "Candle" : "candlestick",
    "OHLC" : "ohlc"
  };
  timeSelectDict = {
    "1M" : {timeUnit : "M", aggregate : 1},
    "3M" : {timeUnit : "M", aggregate : 3},
    "5M" : {timeUnit : "M", aggregate : 5},
    "10M" : {timeUnit : "M", aggregate : 10},
    "15M" : {timeUnit : "M", aggregate : 15},
    "30M" : {timeUnit : "M", aggregate : 30},
    "1H" : {timeUnit : "H", aggregate : 1},
    "2H" : {timeUnit : "H", aggregate : 2},
    "4H" : {timeUnit : "H", aggregate : 4},
    "6H" : {timeUnit : "H", aggregate : 6},
    "12H" : {timeUnit : "H", aggregate : 12},
    "1D" : {timeUnit : "D", aggregate : 1},
    "3D" : {timeUnit : "D", aggregate : 3},
    "1W" : {timeUnit : "D", aggregate : 7}
  };

  private coinStringListSub = new BehaviorSubject([]);
  coinStringList = this.coinStringListSub.asObservable();

  private selectedCoinSub = new BehaviorSubject("");
  selectedCoin = this.selectedCoinSub.asObservable();

  private selectedFiatSub = new BehaviorSubject("");
  selectedFiat = this.selectedFiatSub.asObservable();

  private selectedChartTypeSub = new BehaviorSubject("");
  selectedChartType = this.selectedChartTypeSub.asObservable();

  private selectedTimeUnitSub = new BehaviorSubject("");
  selectedTimeUnit = this.selectedTimeUnitSub.asObservable();

  private coinsSub = new BehaviorSubject({});
  coins = this.coinsSub.asObservable();

  private allCoinsSub = new BehaviorSubject({});
  allCoins = this.allCoinsSub.asObservable();

  constructor(public _http: HttpClient, private _persistenceService: PersistenceService) { 

    var data = this._persistenceService.get('coinStringList', StorageType.LOCAL);
    this.coinStringListSub.next(data ? data : (this.defaultCoins.length > 0 ? this.defaultCoins : ["BTC"]));

    data = this._persistenceService.get('selectedCoin', StorageType.LOCAL);
    this.selectedCoinSub.next(data ? data : this.coinStringListSub.getValue()[0]);

    data = this._persistenceService.get('selectedFiat', StorageType.LOCAL);
    this.selectedFiatSub.next(data ? data : this.fiatList[0]);

    data = this._persistenceService.get('selectedChartType', StorageType.LOCAL);
    this.selectedChartTypeSub.next(data ? data : this.chartTypeDict["Candle"]);

    data = this._persistenceService.get('selectedTimeUnit', StorageType.LOCAL);
    this.selectedTimeUnitSub.next(data ? data : Object.keys(this.timeSelectDict)[0]);

    this.getAllCoins().subscribe(res => {
      this.allCoinsSub.next(res['Data']);
    });

    this.setRefreshCoins();
  }

  setRefreshCoins() {
    this.coinStringList.subscribe(coins => {
      this.getCoins(coins).subscribe(res => {
        this.coinsSub.next(res);
      });
    });
  }

  addCoin(coin){
    var list = this.coinStringListSub.getValue();
    list.push(coin);
    this.coinStringListSub.next(list);
    this._persistenceService.set('coinStringList', list, {type: StorageType.LOCAL});
  }

  removeCoin(coin){
    var list = this.coinStringListSub.getValue();
    if(list.length > 1){
      if(coin == this.selectedCoinSub.getValue()){
        var nextCoin = list.indexOf(coin) != 0 ? list[0] : list[1];
        this.selectedCoinSub.next(nextCoin);
        this._persistenceService.set('selectedCoin', nextCoin, {type: StorageType.LOCAL});
      }
      list.splice(list.indexOf(coin),1);
      this.coinStringListSub.next(list);
      this._persistenceService.set('coinStringList', list, {type: StorageType.LOCAL});
    }
  }

  selectCoin(newCoin: string) {
    this.selectedCoinSub.next(newCoin);
    this._persistenceService.set('selectedCoin', newCoin, {type: StorageType.LOCAL});
  }

  selectFiat(newFiat: string) {
    this.selectedFiatSub.next(newFiat);
    this._persistenceService.set('selectedFiat', newFiat, {type: StorageType.LOCAL});
  }

  selectChartType(newChartType: string) {
    this.selectedChartTypeSub.next(this.chartTypeDict[newChartType]);
    this._persistenceService.set('selectedChartType', this.chartTypeDict[newChartType], {type: StorageType.LOCAL});
  }

  selectTimeUnit(newTimeUnit: string) {
    this.selectedTimeUnitSub.next(newTimeUnit);
    this._persistenceService.set('selectedTimeUnit', newTimeUnit, {type: StorageType.LOCAL});
  }

  getCoin(coin) {
    return this._http.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coin + "&tsyms=" + this.fiatList)
      .pipe(map(result => this.result = result));
  }

  getCoins(coins) {
    return this._http.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coins.join() + "&tsyms=" + this.fiatList)
    	.pipe(map(result => this.result = result));
  }

  getAllCoins() {
    //let headers = new HttpHeaders().set("Access-Control-Allow-Origin", "*");
    return this._http.get("https://min-api.cryptocompare.com/data/all/coinlist")
      .pipe(map(result => this.result = result));
  }

  getChartData() {
    var limit = 600;
    var timeObj = this.timeSelectDict[this.selectedTimeUnitSub.getValue()];
    switch (timeObj['timeUnit']) {
      case "M":
        var time = "minute";
        break;
      case "H":
        var time = "hour";
         break;
      case "D":
        var time = "day"
         break;
      default:
         throw "timeUnit must be \"M\", \"H\", or \"D\"";
    }
    return this._http.get("https://min-api.cryptocompare.com/data/histo" + time + "?&e=CCCAGG&tsym=" 
      + this.selectedFiatSub.getValue() + "&fsym=" + this.selectedCoinSub.getValue() + "&limit=" + limit + "&aggregate=" 
      + timeObj['aggregate']).pipe(map(result => this.result = result));
  }
}
