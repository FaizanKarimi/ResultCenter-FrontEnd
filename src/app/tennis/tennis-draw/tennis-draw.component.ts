import { Component, OnChanges, Input, SimpleChanges, EventEmitter, Output, ElementRef, OnDestroy } from '@angular/core';
import { ApiUrls } from '../../CommonUtility/apiUrls';
import { MemoryService } from '../../services/memory.service';
import * as _ from 'lodash';
import { CommonService } from "../../services/common.service";
import { HttpService } from "../../services/httpService";
import { Observable } from 'rxjs/Rx';
import { TennisEnum } from "../../BusinessModel/Tennis/tennis-enum";
import { TennisScoreInfoTypeEnum } from "../../BusinessModel/Tennis/tennis-score-info-type-enum.enum";
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-tennis-draw',
  templateUrl: './tennis-draw.component.html',
  styleUrls: ['./tennis-draw.component.css']
})
export class TennisDrawComponent implements OnChanges, OnDestroy {
  private timerSubscription: any;
  isLoading: boolean = true;
  tennisDrawResult: any;
  statusMessage: string;
  selectedRoundText: string;
  selectedRoundId: number;
  drawRounds: any;
  RoundsErrorMessage: string;
  MatchesErrorMessage: string;
  languageKeys: any;

  @Input() selectedContestId: number;

  constructor(private _languageService: LanguageService, private _commonService: CommonService, private _httpService: HttpService, private _memoryService: MemoryService, private _elementRef: ElementRef) {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    this.selectedRoundText = this.languageKeys.ROUNDS;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedContestId'] != undefined && changes['selectedContestId'].currentValue != undefined)
      this._getRoundsFromServer(this.selectedContestId);
  }

  ngOnDestroy() {
    if (this.timerSubscription)
      this.timerSubscription.unsubscribe();
  }

  onSelectRound(contestGroupId: number, contestGroupRoundId: number, roundName: string) {
    this.RoundsErrorMessage = '';
    this.MatchesErrorMessage = '';
    this.selectedRoundText = roundName;
    this.selectedRoundId = contestGroupRoundId;
    _.forEach(this.drawRounds, function (item) {
      item.Round == roundName ? item.IsSelected = 1 : item.IsSelected = 0;
    });
    this._memoryService.saveTennisDropDownValue(roundName, TennisEnum.RoundName);
    this._memoryService.saveTennisDropDownValue(contestGroupRoundId, TennisEnum.RoundId);
    this._getDrawResultFromServer(contestGroupId, contestGroupRoundId);
  }

  private _getDrawResultFromServer(contestGroupId: number, contestGroupRoundId: number) {
    this.isLoading = true;
    let body = { SportId: 2, ContestGroupId: contestGroupId, ContestGroupRoundId: contestGroupRoundId };

    this._httpService.getDataFromServer(ApiUrls.TennisDrawResult, '', body)
      .subscribe(
        (response) => {
          this.isLoading = false;
          let data = (<any>response).data;
          if (data != null && data.length > 0) {
            //Removing the game score from results
            _.forEach(data, function (_matches) {
              _matches.MatchScores = _.filter(_matches.MatchScores, function (_matchScores) {
                return !(_matchScores.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Finished || _matchScores.ScoreInfoTypeId == TennisScoreInfoTypeEnum.CFS);
              });
            });
            this.tennisDrawResult = data;
          }
          else {
            this.tennisDrawResult = null;
            this.isLoading = false;
            this.MatchesErrorMessage = this.languageKeys.MATCHES_ARE_NOT_AVAILABLE;
          }
        }, (error) => {
          this.isLoading = false;
          this.statusMessage = 'Problem in service please try again after some time';
        }
      );
  }

  private _getRoundsFromServer(contestGroupId: number) {
    let body = { ContestGroupId: contestGroupId };
    this._httpService.getDataFromServer(ApiUrls.TennisContestGroupRounds, '', body)
      .subscribe(
        (response) => {
          let data = (<any>response).data;
          this.drawRounds = data;
          if (this.drawRounds && this.drawRounds.length > 0) {
            let contestGroupRoundId = this._bindRoundData();
            this.selectedRoundId = contestGroupRoundId;
            this._getDrawResultFromServer(contestGroupId, contestGroupRoundId);
          }
          else {
            this.drawRounds = null;
            this.isLoading = false;
            this.RoundsErrorMessage = this.languageKeys.ROUNDS_ARE_NOT_AVAILABLE;
          }
        }, (error) => {
          this.isLoading = false;
          this.statusMessage = 'Problem in service please try again after some time';
        }
      );
  }

  private _bindRoundData(): number {
    let contestGroupRoundId = 0;
    let roundName = this._memoryService.getTennisDropDownValues(TennisEnum.RoundName);
    let roundId = this._memoryService.getTennisDropDownValues(TennisEnum.RoundId);

    //Checking in memory data if already present.
    if (roundName != null && roundName != '') {
      let round = _.find(this.drawRounds, (_round) => {
        return _round.ContestGroupRoundId == roundId;
      });
      round.IsSelected = 1;
      this.selectedRoundText = round.Round;
      contestGroupRoundId = round.ContestGroupRoundId;
    }
    else {
      let round = _.find(this.drawRounds, function (item) {
        return item.IsSelected == 1;
      });
      //if all the league matches are finished then show the last round as selected.
      if (round === undefined) {
        this.drawRounds[this.drawRounds.length - 1] ? this.drawRounds[this.drawRounds.length - 1].IsSelected = 1 : this.drawRounds[0].IsSelected = 1;
        this.selectedRoundText = this.drawRounds[this.drawRounds.length - 1].Round;
        contestGroupRoundId = this.drawRounds[this.drawRounds.length - 1].ContestGroupRoundId;
      } else {
        this.selectedRoundText = round.Round;
        contestGroupRoundId = round.ContestGroupRoundId;
      }
    }
    return contestGroupRoundId;
  }
}
