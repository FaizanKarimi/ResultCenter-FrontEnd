import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statHeaders'
})
export class StatHeadersPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 1: case 2:
        return 'Pct';
      case 3:
        return 'Aces';
      case 4:
        return 'Points';
    }
  }

}
