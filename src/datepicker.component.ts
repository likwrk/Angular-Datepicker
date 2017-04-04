import {
  animate, Component, ElementRef, EventEmitter, Input, keyframes, OnChanges,
  OnInit, Output, Renderer, SimpleChange, state, style, transition, trigger,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';

interface ValidationResult {
  [key: string]: boolean;
}

@Component({
  selector: 'material-datepicker',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .datepicker {
      position: relative;
      display: inline-block;
      color: #2b2b2b;
      font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'Calibri', 'Roboto';
    }
    .datepicker__input {
      outline: none;
      border-radius: 0.1rem;
      padding: .2em .6em;
      font-size: 14px;
    }
  `],
  template: `
    <div class="datepicker">
      <input
        [disabled]="disabled"
        class="datepicker__input"
        [placeholder]="placeholder"
        (click)="onInputClick()"
        [(ngModel)]="inputText"
        readonly="true"
      >
      <material-datepicker-calendar
        [maxDate]="maxDate"
        [minDate]="minDate"
        [showMonths]="showMonths"
        [dates]="dates"
        (onSelect)="onSelectDay($event)"
        [showCalendar]="true"></material-datepicker-calendar>
    </div>
    `
})
export class DatepickerComponent implements OnInit, OnChanges {
  private readonly DEFAULT_FORMAT = 'MM/DD/YYYY';

  private dates: Array<moment.Moment> = [];

  @Input() date: Array<Date> = [];
  // api bindings
  @Input() disabled: boolean;
  @Input() dateFormat: string = this.DEFAULT_FORMAT;
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() isRange: boolean = false;
  // data
  @Input() placeholder: string = 'Select a date';
  @Input() inputText: string;
  // view logic
  @Input() showCalendar: boolean = false;
  @Input() showMonths: number = 2;
  // events
  @Output() onSelect = new EventEmitter<Date>();
  @Output() onDateChange = new EventEmitter<Array<Date>>();

  // listeners
  clickListener: Function;

  constructor(private renderer: Renderer, private elementRef: ElementRef) {
    // listeners
    this.clickListener = renderer.listenGlobal(
      'document',
      'click',
      (event: MouseEvent) => this.handleGlobalClick(event)
    );
  }

  ngOnInit() {}

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    this.dates = (this.date || []).map(date => moment(date));
    this.syncVisualsWithDate();
    console.log('this.dates', this.dates);
  }

  ngOnDestroy() {
    this.clickListener();
  }

  closeCalendar(): void {
    this.showCalendar = false;
    this.syncVisualsWithDate();
  }


  /**
  * Visually syncs calendar and input to selected date or current day
  */
  syncVisualsWithDate(): void {
    if (this.date) {
      this.setInputText(this.dates);
    } else {
      this.inputText = '';
    }
  }

  /**
  * Sets the visible input text
  */
  setInputText(dates: Array<moment.Moment>): void {
    let inputText = '';
    const format = this.dateFormat || this.DEFAULT_FORMAT;
    this.inputText = dates.map(date => {
      return date.format(format);
    }).join(' - ');
  }

  /**
  * Closes the calendar when the cancel button is clicked
  */
  onCancel(): void {
    this.closeCalendar();
  }

  /**
  * Toggles the calendar when the date input is clicked
  */
  onInputClick(): void {
    this.showCalendar = !this.showCalendar;
  }

  onSelectDay(day: moment.Moment): void {
    if (!this.isDateValid(day)) return;
    this.onSelect.emit(day.toDate());
    if (!this.isRange) {
      this.onDateChange.emit([day.toDate()]);
      // this.showCalendar = !this.showCalendar;
      return;
    }

    let dates = this.dates.slice();
    if (!dates[0]) {
      dates[0] = day;
    } else if (day.isSameOrBefore(dates[0])) {
      dates = [day, dates[0]];
    } else {
      dates[1] = day;
    }
    this.onDateChange.emit(dates.map(date => date.toDate()));
  }

  isDateValid(day: moment.Moment): boolean {
    if (this.maxDate && this.minDate) {
      return day.isSameOrAfter(this.minDate, 'day') && day.isSameOrBefore(this.maxDate, 'day');
    }
    if (this.minDate) {
      return day.isSameOrAfter(this.minDate, 'day');
    }
    if (this.maxDate) {
      day.isSameOrBefore(this.maxDate, 'day');
    }
    return true;
  }

  /**
  * Closes the calendar if a click is not within the datepicker component
  */
  handleGlobalClick(event: MouseEvent): void {
    const withinElement = this.elementRef.nativeElement.contains(event.target);
    if (!withinElement && !this.isRange) {
      this.closeCalendar();
    }
  }

}
