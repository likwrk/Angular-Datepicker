import { Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';


@Component({
  selector: 'material-datepicker-calendar-day',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .datepicker__calendar__month__day {
      display: inline-block;
      width: 2.2em;
      height: 2.2em;
      margin: 0;
      border-radius: 2.2em;
      line-height: 2.2em;
      text-align: center;
      -webkit-transition: 0.37s;
      transition: 0.37s;
    }
    .datepicker__calendar__month__day.is-selected {
      border-radius: 50%;
      background-color: #187829;
      color: #fff;
    }
    .datepicker__calendar__month__day.outside-month {
      display: none;
    }
    .datepicker__calendar__month__day.in-range {
      color: #187829;
    }

  `],
  template: `
    <div (click)="onSelectDay(day)"
      [ngClass]="{'is-selected': isSelected, 'in-range': inRange, 'outside-month': outsideMonth, 'datepicker__calendar__month__day': true}">
      <span> {{ day.date() }} </span>
    </div>
  `
})
export class DatepickerCalendarDayComponent implements OnInit, AfterViewInit {

  @Input() day: moment.Moment;

  @Output() onSelect = new EventEmitter<moment.Moment>();

  @Input() isSelected = false;
  @Input() inRange = false;
  @Input() outsideMonth = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // this.cdr.detach();
  }

  onSelectDay(day: moment.Moment): void {
    this.onSelect.emit(day);
  }

  ngOnInit() {}
}
