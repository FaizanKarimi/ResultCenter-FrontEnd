import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IceHockeyRounds } from "../../BusinessModel/IceHockey/IceHockeyRounds";
import { HttpService } from "../../services/httpService";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import * as _ from 'lodash';
import { MemoryService } from "../../services/memory.service";
import { IceHockeyMatch } from "../../BusinessModel/IceHockey/IceHockeyMatch";
import { LanguageService } from '../../services/language.service';
import { MatchScoreFormatService } from "../services/match-score-format.service";
import { IceHockeyEnum } from "../../BusinessModel/IceHockey/ice-hockey-enum";
import { Subscription } from 'rxjs';
import { LiveSportsService } from '../../services/live-sports.service';
import { SportIdEnum } from '../../BusinessModel/Shared/sportId-enum';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-league-results',
  templateUrl: './league-results.component.html',
  styleUrls: ['../ice-hockey-home/ice-hockey-home.component.css']
})

export class LeagueResultsComponent implements OnChanges, OnInit, OnDestroy {
  roundsList: IceHockeyRounds[];
  isRoundsNull: boolean;
  isLoading: boolean;
  selectedRoundName: string;
  selectedRoundId: number;
  isMatchListNull: boolean;
  matchesList: IceHockeyMatch[];
  languageKeys: any;
  liveSportsSubcription: Subscription;
  IsAnyLiveMatch: boolean;

  @Input() inputSelectedContestId: number;

  constructor(private _commonService: CommonService, private _liveSportsService: LiveSportsService, private _httpService: HttpService, private _memoryService: MemoryService, private _matchScoreFormatService: MatchScoreFormatService, private _languageService: LanguageService) {
    this.roundsList = new Array<IceHockeyRounds>();
    this.matchesList = new Array<IceHockeyMatch>();
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
      var _iceHockeyObj = sports.find(sport => {
        return sport.SportId === SportIdEnum.IceHockey;
      })
      if (_iceHockeyObj.IsLive && this.IsAnyLiveMatch) {
        this.getResultListFromServer(this.inputSelectedContestId, this.selectedRoundId, true);
      }
    })
  }

  ngOnDestroy() {
    if (this.liveSportsSubcription)
      this.liveSportsSubcription.unsubscribe();
  }

  onRoundSelected(roundId: number, roundName: string) {
    this.selectedRoundName = roundName;
    this.selectedRoundId = roundId;
    this._memoryService.saveIceHockeyDropDownValue(roundId, IceHockeyEnum.RoundId);
    this._memoryService.saveIceHockeyDropDownValue(roundId, IceHockeyEnum.RoundName);
    this.isLoading = true;
    this.matchesList = new Array();
    this.getResultListFromServer(this.inputSelectedContestId, roundId);
  }


  // http services methods
  getRoundsFromServer(contestId: number) {
    this.isLoading = true;
    this.roundsList = new Array<IceHockeyRounds>();
    let body = { ContestGroupId: contestId };
    this._httpService.getDataFromServer(ApiUrls.IceHockeyRounds, 'test', body).subscribe(
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

  getResultListFromServer(contestId: number, roundId, isLive?: boolean) {
    let body = { ContestGroupId: contestId, ContestGroupRoundId: roundId, IsLive: isLive ? isLive : false }
    this._httpService.getDataFromServer(ApiUrls.IceHockeyMatchesbyRound, 'test', body).subscribe(
      (response) => {
        if ((<any>response).data && (<any>response).data.length > 0) {
          this.isMatchListNull = false;
          this.matchesList = this._matchScoreFormatService.getFormattedMatchSocres((<any>response).data);
          this.IsAnyLiveMatch = this._commonService.checkTodayMatches(SportIdEnum.IceHockey, this.matchesList);
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
    let _inMemoryRoundId = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.RoundId);
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

