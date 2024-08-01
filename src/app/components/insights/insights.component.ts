import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [
    HighchartsChartModule,
    CommonModule
  ],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})
export class InsightsComponent {
  @Input() trend_info: any;
  @Input() sentiment_info: any;
  @Input() earning_info: any;
  @Input() queryTicker: string = '';
  @Input() company_info: any = '';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  chartConstructor: string = 'chart';
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;
  runOutsideAngular: boolean = false;

  Highcharts2: typeof Highcharts = Highcharts;
  chartOptions2!: Highcharts.Options;
  chartConstructor2: string = 'chart';
  updateFlag2: boolean = false;
  oneToOneFlag2: boolean = true;
  runOutsideAngular2: boolean = false;

  totalMspr: number = 0;
  positiveMspr: number = 0;
  negativeMspr: number = 0;
  totalChange: number = 0;
  positiveChange: number = 0;
  negativeChange: number = 0;

  ngOnInit() {
    this.initializeTrendChart();
    this.initializeSurpriseChart();
    this.calculateSentiment();
  }

  calculateSentiment() {

    this.totalMspr = 0;
    this.totalChange = 0;
    this.positiveMspr = 0;
    this.negativeMspr = 0;
    this.positiveChange = 0;
    this.negativeChange = 0;

    if (this.sentiment_info.length > 0 && this.sentiment_info[0].data) {
      for (let i = 0; i < this.sentiment_info[0].data.length; i++) {
        const item = this.sentiment_info[0].data[i];

        this.totalMspr += item.mspr;
        this.totalChange += item.change;

        if (item.mspr < 0) {
          this.negativeMspr += item.mspr;
          this.negativeChange += item.change;
        } else {
          this.positiveMspr += item.mspr;
          this.positiveChange += item.change;
        }
      }
    }

    this.totalMspr = Number(this.totalMspr.toFixed(2));
    this.positiveMspr = Number(this.positiveMspr.toFixed(2));
    this.negativeMspr = Number(this.negativeMspr.toFixed(2));
  }

  initializeTrendChart(): void {
    let dates: Array<string> = [];
    let strongbuy: Array<string> = [];
    let buy: Array<string> = [];
    let hold: Array<string> = [];
    let sell: Array<string> = [];
    let strongsell: Array<string> = [];

    for (let i = 0; i < this.trend_info.length; i++ ) {
      dates.push(this.trend_info[i].period.slice(0,7));
      strongbuy.push(this.trend_info[i].strongBuy);
      buy.push(this.trend_info[i].buy);
      hold.push(this.trend_info[i].hold);
      sell.push(this.trend_info[i].sell);
      strongsell.push(this.trend_info[i].strongSell);
    }

    this.chartOptions = {
      chart: {
          type: 'column',
          backgroundColor: '#f0f0f0',
      },

      title: {
          text: 'Recommendation Trends',
          align: 'center'
      },

      xAxis: {
          categories: dates
      },

      yAxis: {
          min: 0,
          title: {
              text: '#Analysis'
          }
      },

      legend: {
          verticalAlign: 'bottom',
          backgroundColor: '#f0f0f0',
      },

      tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },

      plotOptions: {
          column: {
              stacking: 'normal',
              dataLabels: {
                  enabled: true
              }
          }
      },

      series: [
        {
          type: 'column',
          name: 'Strong Buy',
          data: strongbuy,
          color: "green",
        }, 
        {
          type: 'column',
          name: 'Buy',
          data: buy,
          color: "#4aba67",
        }, 
        {
          type: 'column',
          name: 'Hold',
          data: hold,
          color: "#c7a748",
        }, 
        {
          type: 'column',
          name: 'Sell',
          data: sell,
          color: "#a56c1b",
        }, 
        {
          type: 'column',
          name: 'Strong Sell',
          data: strongsell,
          color: "#a5321b",
        }
      ]
    };
  }

  initializeSurpriseChart(): void {
    let dates: Array<string> = [];
    let surprise: Array<string> = [];
    let actual: Array<string> = [];
    let estimate: Array<string> = [];

    for (let i = 0; i < this.trend_info.length; i++ ) {
      dates.push(this.earning_info[i].period);
      surprise.push(this.earning_info[i].surprise);
      actual.push(this.earning_info[i].actual);
      estimate.push(this.earning_info[i].estimate);
    }

    let xAxisVal = dates.map((date, index) => `${date} <br> Surprise: ${surprise[index]}`);

    this.chartOptions2 = {
      chart: {
          type: 'spline',
          backgroundColor: '#f0f0f0',
      },

      title: {
          text: 'Historical EPS Surprises',
          align: 'center'
      },

      xAxis: {
        categories: xAxisVal,
        accessibility: {
            rangeDescription: 'Range: last 4 months'
        },
        maxPadding: 0.05,
      },

      yAxis: {
          title: {
              text: 'Quaterly EPS'
          },
          labels: {
              format: '{value}'
          },
          accessibility: {
              rangeDescription: 'Range: 0 to 1'
          },
      },

      legend: {
          enabled: true
      },

      tooltip: {
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormat: 'Earnings: {point.y}'
      },

      plotOptions: {
          spline: {
              marker: {
                  enabled: true
              }
          }
      },

      series: [{
        type: "spline",
        name: 'Actual',
        data: actual
      },{
        type: "spline",
        name: 'Estimate',
        data: estimate
      }]
    };
  }

}
