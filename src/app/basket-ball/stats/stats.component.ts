import { Component, OnInit } from '@angular/core';
import { HttpService } from "../../services/httpService";
import { MemoryService } from "../../services/memory.service";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import { StatCalculationService } from "./stat-calculation.service";
import { LanguageService } from '../../services/language.service';
import { BasketballEnum } from "../../BusinessModel/Basketball/basketball-enum";

@Component({
  selector: 'basketball-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  isLoading: boolean;
  statsResult: any;
  languageKeys: any;
  constructor(private _httpService: HttpService, private _memoryService: MemoryService, private _statsCalculationService: StatCalculationService, private _languageService: LanguageService) {
  }

  ngOnInit() {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    let contestGroupId = this._memoryService.getBasketballDropDownValues(BasketballEnum.ContestGroupId);
    if (contestGroupId) {
      this.getStatsFromServer(contestGroupId);
    }

  }
  getStatsFromServer(contestGroupId: number) {
    this.isLoading = true;
    let body = { ContestGroupId: contestGroupId };
    this._httpService.getDataFromServer(ApiUrls.BasketballStats, '', body)
      .subscribe((response) => {
        let data = (<any>response).data;
        if (data && data.length > 0) {
          this.statsResult = this._statsCalculationService.getCalculatedStats(data);
        }
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
        //this.statusMessage = 'Problem in service please try again after some time';
      });
  }
}

