import {
  animate, Component, ElementRef, EventEmitter, Input, keyframes, OnChanges,
  OnInit, Output, SimpleChange, style, transition, trigger,
  ViewEncapsulation, ChangeDetectionStrategy, SimpleChanges
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';
import { CalendarUtils } from './utils/calendar-utils';
import { Output } from '@angular/core';

interface DateFormatFunction {
  (date: Date): string;
}

interface ValidationResult {
  [key: string]: boolean;
}

@Component({
  selector: 'material-datepicker-calendar-month',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('calendarAnimation', [
      transition('* => left', [
        animate(180, keyframes([
          style({ transform: 'translateX(105%)', offset: 0.5 }),
          style({ transform: 'translateX(-130%)', offset: 0.51 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ]),
      transition('* => right', [
        animate(180, keyframes([
          style({ transform: 'translateX(-105%)', offset: 0.5 }),
          style({ transform: 'translateX(130%)', offset: 0.51 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ])
    ])
  ],
  styles: [`
    .datepicker__calendar__month {
      width: 20em;
      display: inline-block;
      vertical-align: top;
    }
    .datepicker__calendar__labels {
      width: 100%;
    }
    .datepicker__calendar__label {
      display: inline-block;
      width: 2.2em;
      height: 2.2em;
      margin: 0;
      line-height: 2.2em;
      text-align: center;
      color: #d8d8d8;
    }
  `],
  template: `
    <div [@calendarAnimation]="animate" class="datepicker__calendar__month">
      <table>
        <caption>{{monthName}}</caption>
        <thead class="datepicker__calendar__labels">
          <th *ngFor="let day of headers">
            <div class="datepicker__calendar__label">{{ day }}</div>
          </th>
        </thead>
        <tbody>
          <tr *ngFor="let week of weeks">
            <td *ngFor="let day of week">
              <material-datepicker-calendar-day
                [isSelected]="isSelected(day)"
                [inRange]="inRange(day)"
                [outsideMonth]="isOutsideMonth(day)"
                (onSelect)="selectDay($event)"
                [day]="day"></material-datepicker-calendar-day>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DatepickerCalendarMonthComponent implements OnInit, OnChanges {

  @Input() month: moment.Moment;
  @Input() dates: Array<moment.Moment>;
  @Output() onDaySelect = new EventEmitter<moment.Moment>();

  private headers: Array<string> = [];

  private monthFormat = 'MMMM YYYY';
  private weeks;
  private animate: string;
  private monthName: string;

  constructor() {
    for (let i = 0; i < 7; i += 1) {
      this.headers.push(moment().weekday(i).format('dd'));
    }
  }
  ngOnInit() {}

  private isOutsideMonth(day: moment.Moment): boolean {
    return !day.isSame(this.month, 'month');
  }

  private selectDay(day: moment.Moment) {
    this.onDaySelect.emit(day);
  }

  private isSelected(day: moment.Moment): boolean {
    return ((this.dates[0] && day.isSame(this.dates[0], 'day')) || (this.dates[1] && day.isSame(this.dates[1], 'day')));
  }

  private inRange(day: moment.Moment): boolean {
    if (!this.dates[0] || !this.dates[1]) return false;
    return day.isBetween(this.dates[0], this.dates[1], 'day');
  }

  ngOnChanges(changes: SimpleChanges) {
    let month = moment(this.month);
    this.monthName = month.format(this.monthFormat);
    this.weeks = CalendarUtils.getCalendarMonthWeeks(month, true);
    // trigger animation
    /*let now = moment();
    let oldDate = <moment.Moment>changes['month'].previousValue || now;
    let newDate = <moment.Moment>changes['month'].currentValue || now;
    if (newDate.toDate().getTime() === oldDate.toDate().getTime() || !changes['month'].previousValue) return;
    let direction = newDate.toDate().getTime() > oldDate.toDate().getTime() ? 'right' : 'left';
    this.triggerAnimation(direction);*/
  }

  triggerAnimation(direction: string): void {
    this.animate = direction;
    setTimeout(() => { this.animate = 'reset'; }, 200);
  }
}
