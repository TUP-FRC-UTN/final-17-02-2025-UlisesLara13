import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha',
  standalone: true
})
export class FechaPipe implements PipeTransform {

  transform(value: string | Date, ...args: unknown[]): string {
    if (!value) return '';

    let date: Date;

    if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }

    date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
