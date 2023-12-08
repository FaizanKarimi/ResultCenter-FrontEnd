import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ApiUrls } from '../../CommonUtility/apiUrls';
import * as _ from 'lodash';
import { MemoryService } from '../../services/memory.service';
import { HttpService } from "../../services/httpService";
import { Observable } from 'rxjs/Rx';
import { CommonService } from '../../services/common.service';
import { LanguageService } from '../../services/language.service';
import { TennisEnum } from "../../BusinessModel/Tennis/tennis-enum";

@Component({
  selector: 'app-tennis-stat',
  templateUrl: './tennis-stat.component.html',
  styleUrls: ['./tennis-stat.component.css']
})
export class TennisStatComponent implements OnDestroy {
  private timerSubscription: any;

  isLoading: boolean = true;
  Stats: any;
  statusMessage: string;
  selectedStatsTypeText: string;
  selectedStatsTypeId: number;
  statsErrorMessage: string;
  tennisStatsType: any = [];
  languageKeys: any;

  @Input() SelectedContestId: number;

  constructor(private _httpService: HttpService, private _memoryService: MemoryService, private _commonService: CommonService, private _languageService: LanguageService) {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    this.tennisStatsType = [
      { StatsTypeId: 1, Value: '% ' + this.languageKeys.SERVICE_GAMES_WON, IsSelected: 0 },
      { StatsTypeId: 2, Value: '% ' + this.languageKeys.RETURN_GAMES_WON, IsSelected: 0 },
      { StatsTypeId: 3, Value: this.languageKeys.AVG_ACES_PER_MACTCH, IsSelected: 0 },
      { StatsTypeId: 4, Value: this.languageKeys.SINGLES_RANKING, IsSelected: 1 },
    ];
    this.selectedStatsTypeId = this.tennisStatsType[3].StatsTypeId;
    this.selectedStatsTypeText = this.tennisStatsType[3].Value;
  }

  ngOnChanges(changes: SimpleChanges) {
    var statsTypeId = this._memoryService.getTennisDropDownValues(TennisEnum.StatsTypeId);
    var statsTypeValue = this._memoryService.getTennisDropDownValues(TennisEnum.StatsTypeValue);
    if (statsTypeValue != null && statsTypeValue != '') {
      this._getStatsFromServer(this.SelectedContestId, statsTypeId);
    } else
      if (changes['SelectedContestId'] != undefined && changes['SelectedContestId'].currentValue != undefined)
        this._getStatsFromServer(this.SelectedContestId, this.selectedStatsTypeId);
  }

  ngOnDestroy() {
    if (this.timerSubscription)
      this.timerSubscription.unsubscribe();
  }

  onSelectStatsType(statsTypeId: number, statsTypeValue: string) {
    this.selectedStatsTypeText = statsTypeValue;
    this.selectedStatsTypeId = statsTypeId;
    _.forEach(this.tennisStatsType, function (item) {
      item.Value == statsTypeValue ? item.IsSelected = 1 : item.IsSelected = 0;
    });
    this._memoryService.saveTennisDropDownValue(statsTypeId, TennisEnum.StatsTypeId);
    this._memoryService.saveTennisDropDownValue(statsTypeValue, TennisEnum.StatsTypeValue);
    this._getStatsFromServer(this.SelectedContestId, statsTypeId);
  }

  private _getStatsFromServer(contestGroupId: number, statsTypeId: number) {
    this.isLoading = true;
    let body = { ContestGroupId: contestGroupId, StatsTypeId: statsTypeId };
    this._httpService.getDataFromServer(ApiUrls.TennisContestGroupStats, "gfdg", body)
      .subscribe((resultData) => {
        this.isLoading = false;
        if ((<any>resultData).data !== undefined) {
          this.Stats = (<any>resultData).data;
        }
        else {
          this.Stats = null;
          this.isLoading = false;
          this.statsErrorMessage = 'Stats is not available';
        }
      }, (error) => {
        this.isLoading = false;
        this.statusMessage = 'Problem in service please try again after some time';
      });
  }
}