import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalPipe'
})
export class DecimalPipe implements PipeTransform {

  transform(value: any, digit: number): number {
    return value.toFixed(digit);
  }

}
