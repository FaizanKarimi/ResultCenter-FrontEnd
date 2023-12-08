import { Component, OnChanges, Input, SimpleChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrls } from '../../CommonUtility/apiUrls';
import { CommonService } from '../../services/common.service';
import { HttpService } from "../../services/httpService";
import { ApiResponseMessage } from "../../CommonUtility/apiResponseMessage";
import { Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';
import { LanguageService } from '../../services/language.service';
import { MemoryService } from '../../services/memory.service';
import { TennisContestGroup } from "../../BusinessModel/Tennis/TennisContestGroupModel";
import { TennisScoreInfoTypeEnum } from "../../BusinessModel/Tennis/tennis-score-info-type-enum.enum";
import { LiveSportsService } from '../../services/live-sports.service';
import { SportIdEnum } from '../../BusinessModel/Shared/sportId-enum';

@Component({
  selector: 'app-league-result-list',
  templateUrl: './league-result-list.component.html',
  styleUrls: ['./league-result-list.component.css']
})
export class LeagueResultListComponent implements OnChanges, OnDestroy, OnInit {

  isLoading: boolean = true;
  results: TennisContestGroup;
  status: string;
  ErrorMessage: string;
  languageKeys: any;
  TennisScoreInfoTypeEnum: typeof TennisScoreInfoTypeEnum = TennisScoreInfoTypeEnum;
  liveSportsSubcription: Subscription;
  IsAnyLiveMatch: boolean;

  @Input() inputSelectedContestId: number;

  constructor(private _liveSportsService: LiveSportsService, private _httpService: HttpService, private _router: Router, private _commonService: CommonService, private _languageService: LanguageService, private _memoryService: MemoryService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.isLoading = true;
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    if (changes["inputSelectedContestId"] != undefined && changes["inputSelectedContestId"].currentValue != undefined)
      this.BindMatchResult(SportIdEnum.Tennis, this.inputSelectedContestId);
  }

  ngOnInit(): void {
    this.liveSportsSubcription = this._liveSportsService.$data.subscribe((sports) => {
      var _tennisObj = sports.find(sport => {
        return sport.SportId === SportIdEnum.Tennis;
      })
      if (_tennisObj.IsLive && this.IsAnyLiveMatch) {
        this.BindMatchResult(SportIdEnum.Tennis, this.inputSelectedContestId, true);
      }
    })
  }

  ngOnDestroy() {
    if (this.liveSportsSubcription)
      this.liveSportsSubcription.unsubscribe();
  }

  redirectToAction(matchId: any, contestGroupName: string, matchStatusId: number, IsMatchScoreAvailable: boolean) {
    //Checking if the contestGroup is not the challenger than donot navigate to tennis match info page.
    var challenger = contestGroupName.substring(0, 4);
    if (matchStatusId != 24 && challenger != 'Chs ' && IsMatchScoreAvailable) {
      this._memoryService.sendMessage(false);
      this._router.navigate(['tennis/tennis-matchinfo', matchId]);
    }
  }

  private BindMatchResult(SportId: number, ContestGroupId: number, isLive?: boolean) {
    let body = { SportId: 2, ContestGroupId: ContestGroupId, IsLive: isLive ? isLive : false };
    this._httpService.getDataFromServer(ApiUrls.TennisLeagueResultList, 'test', body)
      .subscribe(
        (response) => {
          this.status = (<any>response).status;
          if (this.status == ApiResponseMessage.success) {
            this.results = (<any>response).data;

            //Removing the set score from the results
            if (this.results != null) {
              _.forEach(this.results.Matches, function (_matches) {
                _matches.MatchScores = _.filter(_matches.MatchScores, function (_matchScores) {
                  return !(_matchScores.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Finished || _matchScores.ScoreInfoTypeId == TennisScoreInfoTypeEnum.CFS);
                });
              });
              this.IsAnyLiveMatch = this._commonService.checkTodayMatches(SportIdEnum.Tennis, this.results.Matches);
            }

            this.status = '';
            this.isLoading = false;
            this.ErrorMessage = '';
          } else {
            this.IsAnyLiveMatch = false;
            this.ErrorMessage = (<any>response).message;
          }
        });
  }
  
  isPointScore(scoreTypeId: number) {
    switch (scoreTypeId) {
      case 9: case 16:
        return true;
      default:
        return false;
    };
  }
}