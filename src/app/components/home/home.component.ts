import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { IGlobalDataSummary } from '../../models/global-data';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  totalConfirmed: string = '0';
  totalActive: string = '0';
  totalDeaths: string = '0';
  totalRecovered: string = '0';
  globalData: IGlobalDataSummary[];
  dataTable: any = [];
  chart = {
    PieChart: ChartType.PieChart,
    ColumnChart: ChartType.ColumnChart,
    columnNames: ['Country', 'Cases'],
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true,
    },
  };
  loading = true;

  constructor(private dataService: DataServiceService) {
    this.globalData = [];
  }

  initChart(caseType: string) {
    this.dataTable = [];

    this.globalData.forEach((cs) => {
      let value: number = 0;
      if (caseType == 'Confirmed') {
        if (cs.confirmed > 2000) value = cs.confirmed;
      }

      if (caseType == 'Active') {
        if (cs.active > 2000) value = cs.active;
      }
      if (caseType == 'Deaths') {
        if (cs.deaths > 1000) value = cs.deaths;
      }

      if (caseType == 'Recovered') {
        if (cs.recovered > 2000) value = cs.recovered;
      }
      this.dataTable.push([cs.country, value as number]);
    });
  }

  ngOnInit() {
    this.dataService.getGlobalData().subscribe({
      next: (result: IGlobalDataSummary[]) => {
        this.globalData = result;
        let tempTotalActive = 0;
        let tempTotalConfirmed = 0;
        let tempTotalDeaths = 0;
        let tempTotalRecovered = 0;
        result.forEach((cs) => {
          if (!Number.isNaN(cs.confirmed)) {
            tempTotalActive += cs.active;
            tempTotalConfirmed += cs.confirmed;
            tempTotalDeaths += cs.deaths;
            tempTotalRecovered += cs.active;
          }
        });
        this.totalActive = new Intl.NumberFormat('de-DE').format(tempTotalActive);
        this.totalConfirmed = new Intl.NumberFormat('de-DE').format(tempTotalConfirmed);
        this.totalDeaths = new Intl.NumberFormat('de-DE').format(tempTotalDeaths);
        this.totalRecovered = new Intl.NumberFormat('de-DE').format(tempTotalRecovered);
        this.initChart('Confirmed');
      },
      complete: () => (this.loading = false)
    });
  }

  updateChart(input: HTMLInputElement) {
    this.initChart(input.value);
  }
}
