import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { IDateWiseData } from 'src/app/models/date-wise-data';
import { IGlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  data: IGlobalDataSummary[] = [];
  countries: string[] = [];
  totalConfirmed: string = '0';
  totalActive: string = '0';
  totalDeaths: string = '0';
  totalRecovered: string = '0';
  dateWiseData: any = [];
  selectedCountry: IDateWiseData[] = [];
  dataTable: any = [];
  chart = {
    LineChart: ChartType.LineChart,
    columnNames: ['Date', 'Cases'],
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
  @ViewChild('input', { static: true }) select!: ElementRef;
  selectedLevel = '';

  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    merge(
      this.dataService.getDateWiseDataUrl().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),

      this.dataService.getGlobalData().pipe(
        map((result) => {
          this.data = result;
          this.data.forEach((cs) => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.loading = false;
        this.updateValue('Vietnam');
        this.select.nativeElement.value = "Vietnam";
      },
    });
  }

  updateValue(country: string) {
    // this.selectedLevel = country;

    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.totalActive = new Intl.NumberFormat('de-DE').format(cs.active);
        this.totalDeaths = new Intl.NumberFormat('de-DE').format(cs.deaths);
        this.totalRecovered = new Intl.NumberFormat('de-DE').format(cs.recovered);
        this.totalConfirmed = new Intl.NumberFormat('de-DE').format(cs.confirmed);
      }
    });
    this.selectedCountry = this.dateWiseData[country].reverse();
    this.updateChart();
  }

  updateChart() {
    this.dataTable = [];
    this.selectedCountry.forEach((cs) => {
      this.dataTable.push([cs.date, cs.cases]);
    });
  }
}
