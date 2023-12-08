import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpService } from "../../services/httpService";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import { StatsCalculationService } from "./stats-calculation.service";
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnChanges {

  statsResult: any;
  calculatedStatsResults: any;
  isStatsNull: boolean;
  isLoading: boolean;
  @Input() inputSelectedContestId: number;
  languageKeys: any;

  constructor(private _httpService: HttpService, private _statServices: StatsCalculationService,private _languageService: LanguageService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    if (changes["inputSelectedContestId"] != undefined && changes["inputSelectedContestId"].currentValue != undefined) {
      this.isLoading = true;
      this.getStatsFromServer(this.inputSelectedContestId);
    }
  }

  getStatsFromServer(contestId: number) {
    this.isLoading = true;
    let body = { ContestGroupId: contestId };
    this._httpService.getDataFromServer(ApiUrls.IceHockeyStats, 'test', body).subscribe(
      (response) => {
        if ((<any>response).data && (<any>response).data.length > 0) {
          this.isStatsNull = false;
          let _result = (<any>response).data;
          this._statServices.setIntance(_result)
          this.statsResult = this._statServices.getInstance();
        }
        else
          this.isStatsNull = true;
        this.isLoading = false;
      }
    );

  }
}

