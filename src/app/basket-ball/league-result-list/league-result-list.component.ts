import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { BasketballRounds } from "../../BusinessModel/Basketball/BasketballRounds";
import { BasketballMatch } from "../../BusinessModel/Basketball/BasketballMatch";
import { HttpService } from "../../services/httpService";
import { MemoryService } from "../../services/memory.service";
import { MatchScoreFormatService } from "../services/match-score-format-service.service";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import * as _ from 'lodash';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';
import { BasketballEnum } from "../../BusinessModel/Basketball/basketball-enum";
import { Subscription } from 'rxjs';
import { LiveSportsService } from '../../services/live-sports.service';
import { SportIdEnum } from '../../BusinessModel/Shared/sportId-enum';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'league-result-list',
  templateUrl: './league-result-list.component.html',
  styleUrls: ['./league-result-list.component.css']
})

export class LeagueResultListComponent implements OnChanges, OnInit, OnDestroy {

  roundsList: BasketballRounds[];
  isRoundsNull: boolean;
  isLoading: boolean;
  selectedRoundName: string;
  selectedRoundId: number;
  isMatchListNull: boolean;
  matchesList: BasketballMatch[];
  languageKeys: any;
  liveSportsSubcription: Subscription;
  IsAnyLiveMatch: boolean;

  @Input() inputSelectedContestId: number;

  constructor(private _commonService: CommonService, private _liveSportsService: LiveSportsService, private _httpService: HttpService, private _memoryService: MemoryService, private _matchScoreFormatService: MatchScoreFormatService, private _languageService: LanguageService, private _router: Router) {
    this.roundsList = new Array<BasketballRounds>();
    this.matchesList = new Array<BasketballMatch>();
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    this.selectedRoundName = this.languageKeys.ROUNDS;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["inputSelectedContestId"] != undefined && changes["inputSelectedContestId"].currentValue != undefined) {
      this.getRoundsFromServer(this.inputSelectedContestId);
    }
  }

  ngOnInit(): void {
    this.liveSportsSubcription = this._liveSportsService.$data.subscribe((sports) => {
      var _basketballObj = sports.find(sport => {
        return sport.SportId === SportIdEnum.Basketball;
      })
      if (_basketballObj.IsLive && this.IsAnyLiveMatch) {
        this.getResultListFromServer(this.inputSelectedContestId, this.selectedRoundId, true);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.liveSportsSubcription)
      this.liveSportsSubcription.unsubscribe();
  }

  redirectToAction(matchId: any, matchStatusId: number, ) {
    //Checking if the contestGroup is not the challenger than donot navigate to tennis match info page.
    if (matchStatusId != 93) {
      this._memoryService.sendMessage(false);
      this._router.navigate(['basket-ball/basketball-matchinfo', matchId]);
    }
  }

  onRoundSelected(roundId: number, roundName: string) {
    this.selectedRoundName = roundName;
    this.selectedRoundId = roundId;
    this._memoryService.saveBasketballDropDownValue(roundId, BasketballEnum.RoundId);
    this._memoryService.saveBasketballDropDownValue(roundId, BasketballEnum.RoundName);
    this.isLoading = true;
    this.getResultListFromServer(this.inputSelectedContestId, roundId);
  }

  getRoundsFromServer(contestId: number) {
    this.isLoading = true;
    this.roundsList = new Array<BasketballRounds>();
    let body = { ContestGroupId: contestId };
    this._httpService.getDataFromServer(ApiUrls.BasketballRounds, 'test', body).subscribe(
      (response) => {
        if ((<any>response).data && (<any>response).data.length > 0) {
          this.isRoundsNull = false;
          this.roundsList = (<any>response).data;
          this._bindRoundData();
        }
        else {
          this.isRoundsNull = true;
          this.onRoundSelected(0, this.languageKeys.ROUNDS);
        }
        this.isLoading = false;
      }
    );
  }

  getResultListFromServer(contestId: number, roundId, islive?: boolean) {
    let _matchesList = new Array<BasketballMatch>();
    let body = { ContestGroupId: contestId, ContestGroupRoundId: roundId, IsLive: islive ? islive : false }
    this._httpService.getDataFromServer(ApiUrls.BasketballMatchesByRoundId, 'test', body).subscribe(
      (response) => {
        if ((<any>response).data && (<any>response).data.length > 0) {
          this.isMatchListNull = false;
          let matches = (<any>response).data;
          _.forEach(matches, (_match) => {
            _match = this._matchScoreFormatService.getFormattedMatchSocres(_match, "-");
            _matchesList.push(_match);
          })
          this.matchesList = _matchesList;
          this.IsAnyLiveMatch = this._commonService.checkTodayMatches(SportIdEnum.Basketball, this.matchesList);
        }
        else {
          this.isMatchListNull = true;
          this.IsAnyLiveMatch = false;
        }
        this.isLoading = false;
      }
    );
  }

  private _bindRoundData() {
    //checking if Round Id exist in Memory
    let _inMemoryRoundId = this._memoryService.getBasketballDropDownValues(BasketballEnum.RoundId);
    let _inMemoryRound = _.find(this.roundsList, function (item) {
      return item.ContestGroupRoundId == _inMemoryRoundId;
    });

    //If round exist in Memory , make it selected
    if (_inMemoryRound != undefined) {
      this.onRoundSelected(_inMemoryRound.ContestGroupRoundId, _inMemoryRound.Round);
    }
    else {
      let round = _.find(this.roundsList, function (item) {
        return item.IsSelected;
      });
      //if all the league matches are finished then show the last round as selected.
      if (round == undefined) {
        this.onRoundSelected(this.roundsList[this.roundsList.length - 1].ContestGroupRoundId, this.roundsList[this.roundsList.length - 1].Round);
      } else this.onRoundSelected(round.ContestGroupRoundId, round.Round);
    }
  }


}
