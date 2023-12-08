import { Injectable } from '@angular/core';
import { HttpService } from './httpService';
import { ApiUrls } from "../CommonUtility/apiUrls";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { MemoryService } from "./memory.service";

@Injectable()
export class LanguageService {

  private languageCode: number;

  constructor(private _httpService: HttpService, private _memoryService: MemoryService) { }

  getLanguageKeysFromServer(): any {
    return this._httpService.getDataFromServer(ApiUrls.LanguageKeys, '', {});
  }

  getInstance(): any {
    let language = this.getLocalStorageItem('Languagekeys');
    return language;
  }

  saveLocalStorageItem(key: string, data: any) {
    localStorage.setItem(key, data);
  }

  getLocalStorageItem(key: string): any {
    return localStorage.getItem(key);
  }

  saveLanguageCode(name: number): void {
    this._memoryService.saveLanguageCode(name);
  }

  getLanguageCode(): number {
    return this.languageCode;
  }

  private errorHandler(error: Response) {
    return "Problem in service please try again after some time;"
  }
}