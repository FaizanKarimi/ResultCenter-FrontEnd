import { Pipe, PipeTransform } from '@angular/core';
import { SportIdEnum } from "../../BusinessModel/Shared/sportId-enum";

@Pipe({
  name: 'countryName'
})
export class CountryNamePipe implements PipeTransform {

  transform(countryName: any, sportId: any, countryId: any, args?: any): any {
    switch (sportId) {
      case SportIdEnum.IceHockey:
        switch (countryId) {
          case 227:
            return 'North America';
          default:
            return countryName;
        }
    }
    return countryName;
  }

}
