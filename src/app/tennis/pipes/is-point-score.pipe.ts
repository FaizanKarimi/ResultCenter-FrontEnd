import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isPointScore'
})
export class IsPointScorePipe implements PipeTransform {

  transform(scoreTypeId: number, args?: any): boolean {
    switch (scoreTypeId) {
      case 9: case 16:
        return true;
      default:
        return false;
    };
  }

}
