import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map} from 'rxjs/operators';
import { IDateWiseData } from '../models/date-wise-data';
import { IGlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  private globalDataUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';
  private dateWiseDataUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  private globalDataUrlEndPoint = '';
  month = 0;
  date = 0;
  year = 0;
  extension = '.csv';

  constructor(private http: HttpClient) {
    let now = new Date();
    now.setDate(now.getDate() - 1);
    this.month = now.getMonth() + 1;
    this.date = now.getDate();
    this.year = now.getFullYear();
    this.globalDataUrlEndPoint = `${this.globalDataUrl}${this.getDate(
      this.month
    )}-${this.getDate(this.date)}-${this.getDate(this.year)}${this.extension}`;
  }

  getDate(date: number) {
    return date < 10 ? '0' + date : date;
  }

  getDateWiseDataUrl() {
    return this.http
      .get(this.dateWiseDataUrl, { responseType: 'text' })
      .pipe(
        map((result) => {
          let rows = result.split('\n');
          let mainData: any = {};
          let header = rows[0];
          let dates = header.split(/,(?=\S)/);
          dates.splice(0, 4);
          rows.splice(0, 1);
          rows.forEach((row) => {
            let cols = row.split(/,(?=\S)/);
            let col = cols[1];
            cols.splice(0, 4);
            mainData[col] = [];
            cols.forEach((value, index) => {
              let dateWise: IDateWiseData = {
                cases: +value,
                country: col,
                date: new Date(Date.parse(dates[index])),
              };
              mainData[col].push(dateWise);
            });
          });

          return mainData;
        })
      );
  }

  getGlobalData() {
    return this.http
      .get(this.globalDataUrlEndPoint, { responseType: 'text' })
      .pipe(
        map((result) => {
          let raw: any = {};
          let rows = result.split('\n');

          rows.splice(0, 1);

          rows.forEach((row) => {
            let cols = row.split(/,(?=\S)/);

            let cs = {
              country: cols[3],
              confirmed: +cols[7],
              deaths: +cols[8],
              recovered: +cols[9],
              active: +cols[10],
            };
            let temp: IGlobalDataSummary = raw[cs.country];
            if (temp) {
              temp.active = cs.active + temp.active!;
              temp.confirmed = cs.confirmed + temp.confirmed!;
              temp.deaths = cs.deaths + temp.deaths!;
              temp.recovered = cs.recovered + temp.recovered!;

              raw[cs.country] = temp;
            } else {
              raw[cs.country] = cs;
            }
          });

          return <IGlobalDataSummary[]>Object.values(raw);
        })
      );
  }
}
