import {
  Component, ElementRef, EventEmitter, Input, OnChanges,
  OnInit, Output, ViewEncapsulation, ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

interface DateFormatFunction {
  (date: Date): string;
}

interface ValidationResult {
  [key: string]: boolean;
}

@Component({
  selector: 'material-datepicker-calendar-nav',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .datepicker__calendar__nav {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: space-between;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      height: 3em;
      background-color: #fff;
      border-bottom: 1px solid #e8e8e8;
    }

    .datepicker__calendar__nav__arrow {
      width: 0.8em;
      height: 0.8em;
      cursor: pointer;
      -webkit-transition: 0.37s;
      transition: 0.37s;
      padding: 5px 15px;
    }

    .datepicker__calendar__nav__arrow:hover {
      -webkit-transform: scale(1.05);
      transform: scale(1.05);
    }

    .datepicker__calendar__nav__chevron {
      fill: #bbbbbb;
      -webkit-transition: 0.37s;
      transition: 0.37s;
    }

    .datepicker__calendar__nav__chevron:hover {
      fill: #2b2b2b;
    }

    .datepicker__calendar__nav__header {
      width: 11em;
      margin: 0 1em;
      text-align: center;
    }

    .datepicker__calendar__nav__header__form {
      display: inline-block;
      margin: 0;
    }

    .datepicker__calendar__nav__header__year {
      display: inline-block;
      width: 3em;
      padding: 2px 4px;
      border: 1px solid #ffffff;
      border-radius: 2px;
      font-size: 1em;
      transition: 0.32s;
    }

    .datepicker__calendar__nav__header__year:focus.ng-invalid {
      border: 1px solid #e82525;
    }

    .datepicker__calendar__nav__header__year:focus.ng-valid {
      border: 1px solid #13ad13;
    }

    .datepicker__calendar__nav__header__year:focus {
      outline: none;
    }
  `],
  template: `
    <div class="datepicker__calendar__nav">
      <div class="datepicker__calendar__nav__arrow" (click)="onArrowClick('left')">
        <svg class="datepicker__calendar__nav__chevron" x="0px" y="0px" viewBox="0 0 50 50">
          <g>
            <path d="M39.7,7.1c0.5,0.5,0.5,1.2,0,1.7L29,19.6c-0.5,0.5-1.2,1.2-1.7,1.7L16.5,32.1c-0.5,0.5-1.2,0.5-1.7,0l-2.3-2.3
                      c-0.5-0.5-1.2-1.2-1.7-1.7l-2.3-2.3c-0.5-0.5-0.5-1.2,0-1.7l10.8-10.8c0.5-0.5,1.2-1.2,1.7-1.7L31.7,0.8c0.5-0.5,1.2-0.5,1.7,0
                      l2.3,2.3c0.5,0.5,1.2,1.2,1.7,1.7L39.7,7.1z" />
          </g>
          <g>
            <path d="M33.4,49c-0.5,0.5-1.2,0.5-1.7,0L20.9,38.2c-0.5-0.5-1.2-1.2-1.7-1.7L8.4,25.7c-0.5-0.5-0.5-1.2,0-1.7l2.3-2.3
                      c0.5-0.5,1.2-1.2,1.7-1.7l2.3-2.3c0.5-0.5,1.2-0.5,1.7,0l10.8,10.8c0.5,0.5,1.2,1.2,1.7,1.7l10.8,10.8c0.5,0.5,0.5,1.2,0,1.7
                      L37.4,45c-0.5,0.5-1.2,1.2-1.7,1.7L33.4,49z" />
          </g>
        </svg>
      </div>
      <div class="datepicker__calendar__nav__header">
        <span>{{ currentMonth }}</span>
        <!-- <input #yearInput class="datepicker__calendar__nav__header__year" placeholder="Year" [formControl]="yearControl" (keyup.enter)="yearInput.blur()"
          (blur)="onYearSubmit()" /> -->
      </div>
      <div class="datepicker__calendar__nav__arrow" (click)="onArrowClick('right')">
        <svg class="datepicker__calendar__nav__chevron" x="0px" y="0px" viewBox="0 0 50 50">
          <g>
            <path d="M8.4,7.1c-0.5,0.5-0.5,1.2,0,1.7l10.8,10.8c0.5,0.5,1.2,1.2,1.7,1.7l10.8,10.8c0.5,0.5,1.2,0.5,1.7,0l2.3-2.3
                      c0.5-0.5,1.2-1.2,1.7-1.7l2.3-2.3c0.5-0.5,0.5-1.2,0-1.7L29,13.2c-0.5-0.5-1.2-1.2-1.7-1.7L16.5,0.8c-0.5-0.5-1.2-0.5-1.7,0
                      l-2.3,2.3c-0.5,0.5-1.2,1.2-1.7,1.7L8.4,7.1z" />
          </g>
          <g>
            <path d="M14.8,49c0.5,0.5,1.2,0.5,1.7,0l10.8-10.8c0.5-0.5,1.2-1.2,1.7-1.7l10.8-10.8c0.5-0.5,0.5-1.2,0-1.7l-2.3-2.3
                      c-0.5-0.5-1.2-1.2-1.7-1.7l-2.3-2.3c-0.5-0.5-1.2-0.5-1.7,0L20.9,28.5c-0.5,0.5-1.2,1.2-1.7,1.7L8.4,40.9c-0.5,0.5-0.5,1.2,0,1.7
                      l2.3,2.3c0.5,0.5,1.2,1.2,1.7,1.7L14.8,49z" />
          </g>
        </svg>
      </div>
    </div>
  `
})
export class DatepickerCalendarNavComponent implements OnInit, OnChanges {

  @Input() month: moment.Moment;
  @Input() showMonths: number = 1;

  @Output() onMonthChage = new EventEmitter<moment.Moment>();

  private yearControl: FormControl;

  /**
  * Sets the current year and current month if the year from
  * yearControl is valid
  */
  onYearSubmit(): void {
    /*if (this.yearControl.valid && +this.yearControl.value !== this.currentYear) {
      this.setCurrentYear(+this.yearControl.value);
      this.setCurrentMonth(this.currentMonthNumber);
    } else {
      this.yearControl.setValue(this.month.year());
    }*/
  }

  /**
  * Sets the date values associated with the calendar.
  * Triggers animation if the month changes
  */
  onArrowClick(direction: string): void {
  /*  const currentMonth: number = this.currentMonthNumber;
    let newYear: number = this.currentYear;
    let newMonth: number;*/
    let newDate: moment.Moment;
    // sets the newMonth
    // changes newYear is necessary
    if (direction === 'left') {
      newDate = this.month.clone().subtract(this.showMonths, 'month');
    } else if (direction === 'right') {
      newDate = this.month.clone().add(this.showMonths, 'month');
    }
    this.onMonthChage.emit(newDate);
  }

  /**
  * Validates that a value is a number greater than or equal to 1970
  */
  yearValidator(control: FormControl): ValidationResult {
    const value = control.value;
    const valid = !isNaN(value) && value >= 1970 && Math.floor(value) === +value;
    if (valid) {
      return null;
    }
    return { 'invalidYear': true };
  }

  /**
  * Validates that a value is within the 'rangeStart' and/or 'rangeEnd' if specified
  */
  /*inRangeValidator(control: FormControl): ValidationResult {
    const value = control.value;

    if (this.currentMonthNumber) {
      const tentativeDate = new Date(+value, this.currentMonthNumber);
      if (this.rangeStart && tentativeDate.getTime() < this.rangeStart.getTime()) {
        return { 'yearBeforeRangeStart': true };
      }
      if (this.rangeEnd && tentativeDate.getTime() > this.rangeEnd.getTime()) {
        return { 'yearAfterRangeEnd': true };
      }
      return null;
    }

    return { 'currentMonthMissing': true };
  }*/

  constructor() {
    // form controls
    this.yearControl = new FormControl('', Validators.compose([
      Validators.required,
      Validators.maxLength(4),
      this.yearValidator,
      // this.inRangeValidator.bind(this)
    ]));
  }

  ngOnInit() {
    this.yearControl.valueChanges.subscribe()
  }

  ngOnChanges() {
    // this.currentMonthNumber = this.month.getMonth();
    // this.currentYear = this.month.getFullYear();
  }
}
