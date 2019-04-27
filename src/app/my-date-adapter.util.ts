import { NativeDateAdapter } from '@angular/material';

export class MyDateAdapter extends NativeDateAdapter {

  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } else {
      return date.toDateString();
    }
  }

  getDayOfWeekNames(style): string[] {
    const SHORT_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return SHORT_NAMES;
  }

  getFirstDayOfWeek(): number {
    return 1;
  }

}
