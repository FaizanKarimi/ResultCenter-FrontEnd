import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playerName'
})
export class PlayerNamePipe implements PipeTransform {

  transform(name: string, args?: any): string {

    //Removing Leading and trailing white spaces from name
    name = name.trim();

    let formatedName = name;
    let nameArray: any;

    if (name.includes(',')) {
      nameArray = name.split(',')
      formatedName = nameArray[0].trim() + ', ' + nameArray[1].trim();
    }
    else
      if (name.includes(' ') && !name.includes(',')) {
        nameArray = name.split(' ')
        if (isNaN(nameArray[1].trim()))
          formatedName = nameArray[0].trim() + ', ' + nameArray[1].trim();
      }
    return formatedName;
  }

}
