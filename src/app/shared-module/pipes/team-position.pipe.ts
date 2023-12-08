import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teamPosition'
})
export class TeamPositionPipe implements PipeTransform {

  transform(position: number): string {
    let pos = '';
    switch (position) {
      case 0:
        pos = '';
        break;
      case 1:
        pos = position + 'st';
        break;
      case 2:
        pos = position + 'nd';
        break;
      case 3:
        pos = position + 'rd';
        break;
      default:
        pos = position + 'th'
        break;
    }
    return pos;
  }

}
