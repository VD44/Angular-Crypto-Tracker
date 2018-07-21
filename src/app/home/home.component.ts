import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { DataService } from '../data.service';
import { timer } from 'rxjs/internal/observable/timer';
import * as Plotly from 'plotly.js/dist/plotly.min.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
  trigger('easeInOut', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate(".3s ease-in-out", style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate(".3s ease-in-out", keyframes([
            style({opacity: 1, transform: 'translateX(0)', offset: 0}),
            style({opacity: 0, transform: 'translateX(-75%)', offset: 1.0}),
        ]))
      ])
    ]),
  	trigger('dropIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), {optional: true}),
        query(':enter', stagger('300ms', [
          animate('.3s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)', offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)', offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ]
})

export class HomeComponent implements OnInit {

  updateInterval:any;
  timer:any;

  selectedFiat:any;
  selectedChartType:any;
  coins: Object;

  showX = false;

  objectKeys = Object.keys;

  @ViewChild('chart') element: ElementRef;

  constructor(private _data : DataService) { }

  ngOnInit() {
  	this.updateInterval = this._data.updateInterval;
    this._data.selectedFiat.subscribe(res => {
      this.selectedFiat = res;
      this.setChart();
    });
    this._data.coins.subscribe(res => {
      this.coins = res['RAW'];
    });
    this._data.selectedCoin.subscribe(res => {
      this.setChart();
    });
    this._data.selectedChartType.subscribe(res => {
      this.selectedChartType = res;
      this.setChart();
    });
    this._data.selectedTimeUnit.subscribe(res => {
      this.setChart();
    });
    this.timer = timer(0, this.updateInterval);
    this.timer.subscribe(t => {
        this.setChart();
    });
  }

  toggleRemoveButtons(){
    this.showX = !this.showX; 
  }

  selectCoin(coin){
    if(!this.showX)
      this._data.selectCoin(coin);
  }

  removeCoin(coin) {
    this._data.removeCoin(coin);
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

  setChart(){
  	this._data.getChartData().subscribe(res => {

      const element = this.element.nativeElement;

      var temp = res['Data'].map((x) => [new Date(x.time * 1000), x.open, x.high, x.low, x.close]);
      temp = temp[0].map((col, i) => temp.map(row => row[i]));

      var data = [{
        x: temp[0],
        open: temp[1],
        high: temp[2],
        low: temp[3],
        close: temp[4], 
        increasing: {line: {color: '#3CBA9F'}, fillcolor : "rgba(60,186,159,0.75)"}, 
        decreasing: {line: {color: '#FF0057'}, fillcolor : "rgba(255,0,87,0.75)"},
        line: {color: 'rgba(31,119,180,1)'}, 
        type: this.selectedChartType, 
        xaxis: 'x', 
        yaxis: 'y'
      }];

      var layout = { 
        margin: {
          r: 20, 
          t: 40, 
          b: 40, 
          l: 60
        }, 
        showlegend: false, 
        xaxis: {
          autorange: true, 
          fixedrange: true,
          title: 'Date', 
          type: 'date',
          rangeslider: {
           visible: false
         }
        }, 
        yaxis: {
          autorange: true,
          fixedrange: true, 
          title: 'Price', 
          domain: [0, 1], 
          type: 'linear'
        },
        plot_bgcolor: "#111",
        outlinecolor: "#111",
      };

      Plotly.purge(element);
      Plotly.plot(element, data, layout);
    });
	}
}
