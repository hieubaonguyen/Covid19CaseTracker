import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent implements OnInit {

  @Input('totalConfirmed')
  totalConfirmed: string;
  @Input('totalDeaths')
  totalDeaths: string;
  @Input('totalActive')
  totalActive: string;
  @Input('totalRecovered')
  totalRecovered: string;

  constructor() {
    this.totalConfirmed = "0";
    this.totalDeaths = "0";
    this.totalActive = "0";
    this.totalRecovered = "0";
  }

  ngOnInit(): void {
  }

}
