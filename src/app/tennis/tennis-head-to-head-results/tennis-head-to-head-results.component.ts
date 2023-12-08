import { Component, OnChanges, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { ApiUrls } from '../../CommonUtility/apiUrls';
import { HttpService } from "../../services/httpService";
import { LanguageService } from '../../services/language.service';
import * as _ from 'lodash';
import { TennisHeadToHeadMatch } from "../../BusinessModel/Tennis/TennisHeadToHeadMatch";
import { TennisHeadToHeadDBModel } from "../../BusinessModel/Tennis/TennisHeadToHeadModel";

@Component({
  selector: 'app-tennis-head-to-head-results',
  templateUrl: './tennis-head-to-head-results.component.html',
  styleUrls: ['./tennis-head-to-head-results.component.css']
})
export class TennisHeadToHeadResultsComponent implements OnChanges, OnDestroy {
  isHomeActiveTab: boolean;
  private timerSubscription: any;

  isLoading: boolean = true;

  headToHeadResults: TennisHeadToHeadDBModel;
  homeTeamBio: any;
  awayTeamBio: any;
  status: string;
  ErrorMessage: string;
  homeTeamWinningPercentage: number;
  awayTeamWinningPercentage: number;
  homeTeamMatches: TennisHeadToHeadMatch[];
  awayTeamMatches: TennisHeadToHeadMatch[];
  languageKeys: any;
  homeTeamWinLoss: any;
  awayTeamWinLoss: any;

  @Input() selectedTeamsObj: any;

  constructor(private _httpService: HttpService, private _languageService: LanguageService) {
    this.headToHeadResults = new TennisHeadToHeadDBModel();
    this.homeTeamBio = this.headToHeadResults.TeamBio;
    this.awayTeamBio = this.headToHeadResults.TeamBio;
    this.isHomeActiveTab = true;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['selectedTeamsObj'] !== undefined) {
      this.selectedTeamsObj = changes['selectedTeamsObj'].currentValue;
      this.getHeadToHeadFromServer(this.selectedTeamsObj);
      this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    }
  }

  ngOnDestroy() {
    if (this.timerSubscription)
      this.timerSubscription.unsubscribe();
  }

  onTabClicked(tabId: number) {
    if (tabId == 1) {
      this.isHomeActiveTab = true;
    }
    else this.isHomeActiveTab = false;
  }

  private getHeadToHeadFromServer(selectedTeamsObj: any) {
    this.isLoading = true;
    let body = {
      firstTeamId: selectedTeamsObj.selectedHomeTeamId,
      secondTeamId: selectedTeamsObj.selectedAwayTeamId
    };
    this._httpService.getDataFromServer(ApiUrls.TennisHeadToHead, "gfdg", body)
      .subscribe((resultData) => {
        this.isLoading = false;
        if ((<any>resultData).data !== undefined) {
          this.headToHeadResults = (<any>resultData).data;

          if (this.headToHeadResults != null) {

            if (this.headToHeadResults.Team1RecentWins.length > 0) {

              this.homeTeamMatches = this._getFormattedMatches(this.selectedTeamsObj.selectedHomeTeamId, this.headToHeadResults.Team1RecentWins);
              this.homeTeamWinLoss = _.orderBy(this.homeTeamMatches, 'MatchDate', 'Asc');
            }
            if (this.headToHeadResults.Team2RecentWins.length > 0) {
              this.awayTeamMatches = this._getFormattedMatches(this.selectedTeamsObj.selectedAwayTeamId, this.headToHeadResults.Team2RecentWins);
              this.awayTeamWinLoss = _.orderBy(this.awayTeamMatches, 'MatchDate', 'Asc');
            }
            if (this.headToHeadResults.TeamBio != undefined) {
              this.homeTeamBio = this.headToHeadResults.TeamBio.find(t => t.HomeAway == true);
              this.awayTeamBio = this.headToHeadResults.TeamBio.find(t => t.HomeAway == false);
            }
            if (this.headToHeadResults.TennisTeamsH2H != undefined && this.headToHeadResults.TennisTeamsH2H.TotalMatchesPlayed > 0) {
              this.homeTeamWinningPercentage = (this.headToHeadResults.TennisTeamsH2H.FirstWon / this.headToHeadResults.TennisTeamsH2H.TotalMatchesPlayed) * 100;
              this.awayTeamWinningPercentage = (this.headToHeadResults.TennisTeamsH2H.SecondWon / this.headToHeadResults.TennisTeamsH2H.TotalMatchesPlayed) * 100;
            }
            else {
              this.homeTeamWinningPercentage = 0;
              this.awayTeamWinningPercentage = 0;
            }
          }
        }
      },
      (error) => {
        this.isLoading = false;
        this.status = 'Problem in service please try again after some time';
      });
  }

  private _getFormattedMatches(teamId: number, teamMatches: any) {
    let thisTeamMatches = new Array<TennisHeadToHeadMatch>();
    _.map(teamMatches, function (match) {
      let matchObj = new TennisHeadToHeadMatch();
      matchObj.MatchId = match.MatchId;
      matchObj.MatchDate = match.MatchDate;
      matchObj.HomeTeamId = match.HomeTeamId;
      matchObj.AwayTeamId = match.AwayTeamId;
      matchObj.HomeTeamName = match.HomeTeamName;
      matchObj.AwayTeamName = match.AwayTeamName;
      matchObj.HomeScore = match.HomeScore;
      matchObj.AwayScore = match.AwayScore;
      if (match.HomeTeamId == teamId && match.HomeScore > match.AwayScore) {
        matchObj.isThisTeamWin = true;
        matchObj.MatchResultStatus = 'W';
      }
      else if (match.AwayTeamId == teamId && match.AwayScore > match.HomeScore) {
        matchObj.isThisTeamWin = true;
        matchObj.MatchResultStatus = 'W';

      }
      else {
        matchObj.isThisTeamWin = false;
        matchObj.MatchResultStatus = 'L';
      }
      thisTeamMatches.push(matchObj);
    })
    return thisTeamMatches;
  }
}
