import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from "../services/language.service";

@Pipe({
  name: 'pointtypePipe'
})
export class PointtypePipe implements PipeTransform {
  languageKeys: any;
  constructor(private _languageService: LanguageService) {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
  }

  transform(value: any): string {
    switch (value) {
      case 1: case "1":
        return this.languageKeys.HOME;
      case 2: case "2":
        return this.languageKeys.AWAY;
      default:
        return this.languageKeys.COMPLETED_MATCHES;
    }
  }

}
