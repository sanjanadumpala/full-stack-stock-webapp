import { Component, Input } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
import HC_stock from 'highcharts/modules/stock';
import HC_map from 'highcharts/modules/map';
import HC_gantt from 'highcharts/modules/gantt';
import VBP from 'highcharts/indicators/volume-by-price';
import IndicatorsCore from 'highcharts/indicators/indicators';
IndicatorsCore(Highcharts);
VBP(Highcharts);
HC_gantt(Highcharts);
HC_map(Highcharts);
HC_stock(Highcharts);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent {
  
  @Input() graph_info: any;
  @Input() queryTicker: string = '';

  chartOptions!: Highcharts.Options;
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart';
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;
  runOutsideAngular: boolean = false;

  ngOnInit() {
    this.initializeChart();
  }
  
  initializeChart(): void {
    const ohlc = [],
        volume = []
    const groupingUnits: [string, (number[] | null)][] = [
      ['week', [1]],
      ['month', [1, 2, 3, 4, 6]]
    ];
    for (let i=0; i < this.graph_info[0].resultsCount; i++) {
      ohlc.push([Number(this.graph_info[0].results[i].t), this.graph_info[0].results[i].o, this.graph_info[0].results[i].h, this.graph_info[0].results[i].l, this.graph_info[0].results[i].c])
    }
    for (let i=0; i < this.graph_info[0].resultsCount; i++) {
      volume.push([Number(this.graph_info[0].results[i].t), this.graph_info[0].results[i].v])
    }
    this.chartOptions = {
      rangeSelector: {
        buttons: [{
          type: 'month',
          count: 1,
          text: '1m',
          title: 'View 1 month'
      }, {
          type: 'month',
          count: 3,
          text: '3m',
          title: 'View 3 months'
      }, {
          type: 'month',
          count: 6,
          text: '6m',
          title: 'View 6 months'
      }, {
          type: 'ytd',
          text: 'YTD',
          title: 'View year to date'
      }, {
          type: 'year',
          count: 1,
          text: '1y',
          title: 'View 1 year'
      }, {
          type: 'all',
          text: 'All',
          title: 'View all'
      }],
      selected: 0,
      enabled: true
      },

      title: {
        text: `${this.queryTicker} Historical`,
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },

      xAxis: {
        type: 'datetime',
      },

      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        opposite: true,
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
            enabled: true
        }
      }, {
        opposite: true,
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },

      plotOptions: {
        series: {
          dataGrouping: {
            units: groupingUnits
            }
        }
      },

      series: [
        {
        type: 'candlestick',
        name: `${this.queryTicker}`,
        id: `${this.queryTicker}`,
        data: ohlc,
      }, 
      {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
      }, 
      {
        type: 'vbp',
        linkedTo: `${this.queryTicker}`,
        params: {
            volumeSeriesID: 'volume'
        },
        dataLabels: {
            enabled: false
        },
        zoneLines: {
            enabled: false
        }
      }, 
      {
        type: 'sma',
        linkedTo: `${this.queryTicker}`,
        zIndex: 1,
        marker: {
            enabled: false
        }
      }
    ],
    navigator: {
      enabled: true
    },
    legend: {
      enabled: false
    }
    };
  }
}
