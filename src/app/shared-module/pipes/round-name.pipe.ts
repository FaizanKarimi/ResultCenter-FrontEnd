import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundName'
})
export class RoundNamePipe implements PipeTransform {

  transform(name: string, args?: any): string {
    let formatedName = name;
    if (name.includes('Quarter Final') || name.includes('Semi Final'))
      formatedName = formatedName + 's';
    return formatedName;
  }

}
