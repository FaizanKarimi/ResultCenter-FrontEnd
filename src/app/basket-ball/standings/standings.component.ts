import { Component, OnInit } from '@angular/core';
import { BasketballStanding } from "../../BusinessModel/Basketball/BasketballStanding";
import { HttpService } from "../../services/httpService";
import { MemoryService } from "../../services/memory.service";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import { LanguageService } from '../../services/language.service';
import { BasketballEnum } from "../../BusinessModel/Basketball/basketball-enum";

@Component({
  selector: 'basketball-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {
  contestGroupId: number;
  standings: BasketballStanding[];
  isLoading;
  languageKeys: any;
  constructor(private _httpService: HttpService, private _memoryService: MemoryService, private _languageService: LanguageService) {
    this.standings = new Array<BasketballStanding>();
    this.isLoading = false;
  }

  ngOnInit() {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));

    this.contestGroupId = this._memoryService.getBasketballDropDownValues(BasketballEnum.ContestGroupId);
    if (this.contestGroupId) {
      this.getStandingsResultFromServer(this.contestGroupId);
    }
  }

  private getStandingsResultFromServer(contestGroupId: number) {
    this.isLoading = true;
    let body = { ContestGroupId: contestGroupId };
    this._httpService.getDataFromServer(ApiUrls.BasketballStandings, '', body)
      .subscribe((response) => {
        let data = (<any>response).data;
        if (data != null && data.length > 0) {
          this.standings = data;
          this.isLoading = false;
        }
        else
          this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
        //this.statusMessage = 'Problem in service please try again after some time';
      });
  }

}
