import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiUrls } from '../../CommonUtility/apiUrls';
import { CommonService } from '../../services/common.service';
import { HttpService } from "../../services/httpService";
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { MatchStatusService } from "../../services/match-status.service";
import { LanguageService } from '../../services/language.service';
import { MemoryService } from '../../services/memory.service';
import { SportIdEnum } from "../../BusinessModel/Shared/sportId-enum";
import { TennisScoreInfoTypeEnum } from "../../BusinessModel/Tennis/tennis-score-info-type-enum.enum";

@Component({
  selector: 'app-tennis-match-info',
  templateUrl: './tennis-match-info.component.html',
  styleUrls: ['./tennis-match-info.component.css']
})
export class TennisMatchInfoComponent {
  private timerSubscription: any;

  gamesWonHome: number = 0;
  gamesWonAway: number = 0;

  matchid: number;
  matchInfo: any;
  matchStats: any;
  isMatchLoading: boolean;
  statusMessage: string;
  languageKeys: any;
  constructor(private _matchinfoService: HttpService, private _avRoute: ActivatedRoute, private _commonService: CommonService,
    private _matchStatusService: MatchStatusService, private _languageService: LanguageService, private _memoryService: MemoryService, private _router: Router) {
    if (this._avRoute.snapshot.params["id"]) {
      this.matchid = this._avRoute.snapshot.params["id"];
      this.getMatchInfoResultFromServer(this.matchid);
    }
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
  }

  ngOnDestroy() {
    if (this.timerSubscription)
      this.timerSubscription.unsubscribe();
  }

  backToTennis() {
    this._memoryService.sendMessage(true);
    this._router.navigate(['tennis']);
  }

  getMatchInfoResultFromServer(matchId: number) {
    this.isMatchLoading = true;
    let body = { SportId: SportIdEnum.Tennis, MatchId: matchId };
    this._matchinfoService.getDataFromServer(ApiUrls.TennisMatchInfo, "gfdg", body)
      .subscribe((resultData) => {
        this.isMatchLoading = false;
        if ((<any>resultData).data !== undefined && (<any>resultData).data !== null) {
          this.matchInfo = (<any>resultData).data;

          let matchScores = _.filter(this.matchInfo.MatchScores, (item) => {
            return item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.CS || item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Set1 || item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Set2 || item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Set3 || item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Set4 || item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Set5;
          });

          matchScores.forEach(element => {
            this.gamesWonHome += parseInt(element.HomeScore);
            this.gamesWonAway += parseInt(element.AwayScore);
          });

          //Filtering match scores and ignoring set scores 
          this.matchInfo.MatchScores = _.filter(this.matchInfo.MatchScores, function (_matchScores) {
            return !(_matchScores.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Finished || _matchScores.ScoreInfoTypeId == TennisScoreInfoTypeEnum.CFS);
          });
          if (this.matchInfo.MatchStats && this.matchInfo.MatchStats.MatchInfoMatchId != null) {
            this.matchStats = this.matchInfo.MatchStats
          }
        }

        //Now the interval will invoke.
        let status = this._matchStatusService.isMatchLive(this.matchInfo.MatchStatusId, SportIdEnum.Tennis)
        if (status) {
          let params = { SportId: SportIdEnum.Tennis, MatchId: matchId, IsLive: true }
          this.timerSubscription = Observable
            .interval(this._commonService.getObservableIntervalTimer())
            .timeInterval()
            .flatMap(() =>
              this._matchinfoService.getDataFromServer(ApiUrls.TennisMatchInfo, 'test', params)
            )
            .subscribe((resultData) => {
              this.isMatchLoading = false;
              if ((<any>resultData).data !== undefined && (<any>resultData).data !== null) {
                this.matchInfo = (<any>resultData).data;
                //#region Calculating the home and away score in memory.
                this.gamesWonHome = 0;
                this.gamesWonAway = 0;
                //Getting the home and away score from 1st till 5th sets.
                let matchScores = _.filter(this.matchInfo.MatchScores, (item) => {
                  return item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.CS || item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Set1 || item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Set2 || item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Set3 || item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Set4 || item.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Set5;
                });

                matchScores.forEach(element => {
                  this.gamesWonHome += parseInt(element.HomeScore);
                  this.gamesWonAway += parseInt(element.AwayScore);
                });
                //#endregion

                //Filtering match scores and ignoring set scores 
                this.matchInfo.MatchScores = _.filter(this.matchInfo.MatchScores, function (_matchScores) {
                  return !(_matchScores.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Finished || _matchScores.ScoreInfoTypeId == TennisScoreInfoTypeEnum.CFS);
                });
                if (this.matchInfo.MatchStats && this.matchInfo.MatchStats.MatchInfoMatchId != null) {
                  this.matchStats = this.matchInfo.MatchStats
                }

              }
            });
        }
        else {
          if (this.timerSubscription)
            this.timerSubscription.unsubscribe();
        }
      },
        (error) => {
          this.isMatchLoading = false;
          this.statusMessage = 'Problem in service please try again after some time';
        });
  }

}