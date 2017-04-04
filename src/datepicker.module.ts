import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { DatepickerComponent } from './datepicker.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatepickerCalendarComponent } from './datepicker-calendar.component';
import { DatepickerCalendarDayComponent } from './datepicker-calendar-day.component';
import { DatepickerCalendarNavComponent } from './datepicker-calendar-nav.component';
import { DatepickerCalendarMonthComponent } from './datepicker-calendar-month.component';

export * from './datepicker.component';

@NgModule({
  declarations: [
    DatepickerComponent,
    DatepickerCalendarComponent,
    DatepickerCalendarNavComponent,
    DatepickerCalendarDayComponent,
    DatepickerCalendarMonthComponent
  ],
  exports: [
    DatepickerComponent,
    DatepickerCalendarComponent,
    DatepickerCalendarNavComponent,
    DatepickerCalendarDayComponent,
    DatepickerCalendarMonthComponent
  ],
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule ]
})
export class DatepickerModule { }
