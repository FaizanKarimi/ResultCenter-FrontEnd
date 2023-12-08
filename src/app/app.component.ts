import { Component, OnInit, OnDestroy } from '@angular/core';
import { MemoryService } from './services/memory.service';
import { Subscription } from 'rxjs/Subscription';
import { LanguageService } from "./services/language.service";
import { HttpResponse } from "@angular/common/http";
import { ApiResponseMessage } from "./CommonUtility/apiResponseMessage";
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  isVisible: boolean;
  loadingRouteConfig: boolean;
  loadingLanguages: boolean;
  private subscription: Subscription;
  error: boolean;
  ErrorMessage: string;

  constructor(private _router: Router, private _memoryService: MemoryService, private _languageService: LanguageService) {
    this.loadingLanguages = true;
  }

  ngOnInit() {
    this._memoryService.getMessage().subscribe(message => {
      this.isVisible = message;
    });

    this._getLanguageKeysFromServer();

    this._router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingRouteConfig = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  private _getLanguageKeysFromServer() {

    this._languageService.getLanguageKeysFromServer().subscribe(
      (response) => {
        let status = (<any>response).status;
        if (status == ApiResponseMessage.success) {
          let languages = response.data;
          this._memoryService.saveLanguageCode(+languages.Language);
          this._languageService.saveLocalStorageItem('Languagekeys', JSON.stringify(response.data));
          this.loadingLanguages = false;
        }
      },
      (error) => {
        this.error = true;
        this.ErrorMessage = 'Cannot fetch data from Server';
        console.log(error);
      });
  }
}
