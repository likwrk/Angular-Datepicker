import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
      <material-datepicker
        [date]="date"
        (onDateChange)="onSelect($event)"
        ddateFormat="YYYY-MM-DD"
        [maxDate]="testRangeDate"
        [showMonths]="1"
        [isRange]="false"
      ></material-datepicker>

      <button (click)="setToday()">today</button>
      <button (click)="clearDate()">reset</button>
      <hr>
      {{ date }}
      <p>
    `
})
export class AppComponent {
  date: Array<Date>;
  disabled: boolean;
  @Input() testRangeDate: Date;

  constructor() {
    this.testRangeDate = new Date();
  }

  formatDate(date: Date): string {
    return date.toLocaleString();
  }

  onSelect(date: Array<Date>) {
    this.date = date;
  }
  clearDate() {
    this.date = [null];
  }
  setToday() {
    this.date = [new Date()];
  }
}
