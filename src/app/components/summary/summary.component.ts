import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HighchartsChartModule,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  @Input() company_info: any;
  @Input() stock_info: any;
  @Input() peer_info: any;
  @Input() graph_info: any;
  @Input() graph_info2: any;
  @Input() queryTicker: string = '';
  @Input() onSearch!: Function;
  @Input() graphColor: string = '';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  updateFlag = false;

  ngOnInit(): void {
    if (this.graph_info2 !== null ) {
      this.initializeChart();
    }
  }

  initializeChart(): void {
    var data = [];
    for (let i=0; i < this.graph_info2[0].resultsCount; i++) {
      data.push([this.graph_info2[0].results[i].t, this.graph_info2[0].results[i].c])
    }
    this.chartOptions = {
      chart: {
        backgroundColor: '#f0f0f0',
      },
      title: {
        text: `${this.queryTicker} Hourly Price Variation`,
        align: 'center'
      },
      yAxis: {
        title: {
            text: ''
        },
        opposite: true,
      },
      xAxis: {
        type: 'datetime',
      },
      plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            marker: {
              enabled: false
            },
            pointStart: 2010
        }
      },
      series: [
        {
          name: `${this.queryTicker}`,
          type: 'line',
          data: data,
          color: this.graphColor
        }
      ],
      legend: {
        enabled: false
      }
    };
  }
}