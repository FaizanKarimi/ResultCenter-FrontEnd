import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teamName'
})
export class TeamNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let _teamName = value.replace(/[\(\\w\)]/g, '');
    return _teamName;
  }

}
