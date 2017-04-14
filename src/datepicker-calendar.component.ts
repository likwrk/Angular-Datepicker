import {
  animate, Component, ElementRef, EventEmitter, Input, keyframes, OnChanges,
  OnInit, Output, Renderer, SimpleChange, state, style, transition, trigger,
  ViewEncapsulation
} from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'material-datepicker-calendar',
  styles: [`
    .datepicker__calendar {
      position: absolute;
      overflow: hidden;
      z-index: 1000;
      top: 1.9em;
      left: 0;
      font-size: 14px;
      background-color: #ffffff;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
      cursor: default;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    .datepicker__calendar__cancel {
      position: absolute;
      bottom: 1em;
      left: 1.8em;
      color: #d8d8d8;
      cursor: pointer;
      -webkit-transition: 0.37s;
      transition: 0.37s;
    }
    .datepicker__calendar__cancel:hover {
      color: #b1b1b1;
    }
    .datepicker__calendar__content {
      margin-top: 0.4em;
      width: 100%;
    }
  `],
  template: `
    <div class="datepicker__calendar" [ngStyle]="{'width': fullCalendarWidth}" *ngIf="showCalendar">
      <material-datepicker-calendar-nav [showMonths]="showMonths" [month]="currentMonth" (onMonthChage)="onMonthChage($event)"></material-datepicker-calendar-nav>
      <div class="datepicker__calendar__content">
        <material-datepicker-calendar-month (onDaySelect)="onDaySelect($event)" *ngIf="showMonths > 2" [dates]="dates" [month]="currentMonth.clone().subtract(1, 'month')"></material-datepicker-calendar-month>
        <material-datepicker-calendar-month (onDaySelect)="onDaySelect($event)" [dates]="dates" [month]="currentMonth"></material-datepicker-calendar-month>
        <material-datepicker-calendar-month (onDaySelect)="onDaySelect($event)" *ngIf="showMonths > 1" [dates]="dates" [month]="currentMonth.clone().add(1, 'month')"></material-datepicker-calendar-month>
        <div class="datepicker__calendar__cancel" (click)="onCancel()">
          {{cancelText}}
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None

})
export class DatepickerCalendarComponent implements OnInit, OnChanges {

  @Input() dates: Array<moment.Moment> = [];
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() showMonths: number = 2;
  @Input() showCalendar: boolean;

  @Output() onSelect = new EventEmitter<moment.Moment>();

  private currentMonth: moment.Moment;

  private fullCalendarWidth: string;
  private monthWidth = 20;

  private onDaySelect(day: moment.Moment) {
    this.onSelect.emit(day);
  }

  private onMonthChage(date: moment.Moment) {
    let newDateValid: boolean;
    newDateValid = (!this.minDate || date.isSameOrAfter(this.minDate, 'month'));
    newDateValid = (!this.maxDate || date.isSameOrBefore(this.maxDate, 'month'));
    if (!newDateValid) {
      return;
    }
    this.currentMonth = date.clone();
  }

  constructor() {}

  ngOnInit() {
    this.currentMonth = this.dates[1] || this.dates[0] || moment();
  }

  ngOnChanges() {
    this.fullCalendarWidth = this.showMonths * this.monthWidth + 1 + 'em';
  }
}
