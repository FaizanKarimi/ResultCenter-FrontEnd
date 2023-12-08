import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { HttpService } from "../../services/httpService";
import { MemoryService } from "../../services/memory.service";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import { BasketballH2HResultSet } from "../../BusinessModel/Basketball/BasketballH2HResultSet";
import { H2hCalculationService } from "./h2h-calculation.service";
import { LanguageService } from '../../services/language.service';
import { BasketballEnum } from "../../BusinessModel/Basketball/basketball-enum";

@Component({
  selector: 'head-to-head',
  templateUrl: './head-to-head.component.html',
  styleUrls: ['./head-to-head.component.css']
})
export class HeadToHeadComponent implements OnInit {

  isAwayTeamselected: boolean = false
  isHomeTeamSelected: boolean = false;
  isLoading: boolean;
  isH2HShow: boolean;
  ContestTeams: any;
  SelectedTeamHome: string;
  SelectedTeamAway: string;
  statusMessage: string = 'Loading data, Please wait...';
  selectedHomeTeamId: number;
  selectedAwayTeamId: number;
  selectedContestGroupId: number;
  isHomeActiveTab: boolean;
  isStatsAvailable: boolean;
  ResultSets: BasketballH2HResultSet;
  languageKeys: any;

  @Input() leagueId: number;

  constructor(private _httpService: HttpService, private _memoryService: MemoryService, private _calculationService: H2hCalculationService, private _languageService: LanguageService) {
    this.ResultSets = new BasketballH2HResultSet();
    this.isHomeActiveTab = true;
  }

  ngOnInit() {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    this.SelectedTeamHome = this.languageKeys.TEAM1;
    this.SelectedTeamAway = this.languageKeys.TEAM2;
    let contestGroupId = this._memoryService.getBasketballDropDownValues(BasketballEnum.ContestGroupId);
    if (contestGroupId) {
      this.getTeamsFromServer(contestGroupId);
      this.selectedContestGroupId = contestGroupId;
    }
    let _homeTeam = this._memoryService.getBasketballDropDownValues(BasketballEnum.SelectedHomeTeamName);
    let _awayTeam = this._memoryService.getBasketballDropDownValues(BasketballEnum.SelectedAwayTeamName);
    let _homeTeamId = this._memoryService.getBasketballDropDownValues(BasketballEnum.SelectedHomeTeamId);
    let _awayTeamId = this._memoryService.getBasketballDropDownValues(BasketballEnum.SelectedAwayTeamId);
    if (_homeTeam != '' && _awayTeam != '') {
      this.onAwayTeamSelected(_awayTeamId, _awayTeam);
      this.onHomeTeamSelected(_homeTeamId, _homeTeam);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  onTabClicked(tabId: number) {
    if (tabId == 1) {
      this.isHomeActiveTab = true;
    }
    else this.isHomeActiveTab = false;
  }

  onHomeTeamSelected(homeTeamId: any, teamName: any) {
    this.selectedHomeTeamId = homeTeamId;
    this.SelectedTeamHome = teamName;
    this.isHomeTeamSelected = true;
    this._getTeamsHeadToHead();
  }

  onAwayTeamSelected(AwayTeamId: any, teamName: any) {
    this.selectedAwayTeamId = AwayTeamId;
    this.SelectedTeamAway = teamName;
    this.isAwayTeamselected = true;
    this._getTeamsHeadToHead();
  }

  private _getTeamsHeadToHead() {
    if (this.isHomeTeamSelected && this.isAwayTeamselected) {
      this._memoryService.saveBasketballDropDownValue(this.selectedHomeTeamId, BasketballEnum.SelectedHomeTeamId);
      this._memoryService.saveBasketballDropDownValue(this.selectedAwayTeamId, BasketballEnum.SelectedAwayTeamId);
      this._memoryService.saveBasketballDropDownValue(this.SelectedTeamHome, BasketballEnum.SelectedHomeTeamName);
      this._memoryService.saveBasketballDropDownValue(this.SelectedTeamAway, BasketballEnum.SelectedAwayTeamName);
      this.getHeadToHeadFromServer(this.selectedContestGroupId, this.selectedHomeTeamId, this.selectedAwayTeamId);
    }
  }

  getHeadToHeadFromServer(contestId: number, homeTeamId: number, awayTeamId: number) {
    this.isLoading = true;
    this.ResultSets = new BasketballH2HResultSet();
    let body = {
      ContestGroupId: contestId,
      homeTeamId: homeTeamId,
      awayTeamId: awayTeamId
    };
    this._httpService.getDataFromServer(ApiUrls.BasketballHeadtoHead, "test", body)
      .subscribe((resultData) => {
        if ((<any>resultData).data) {
          this.isH2HShow = true;
          let _data = (<any>resultData).data;

          //Last 6 meetings.
          if (_data.basketballh2hMatches && _data.basketballh2hMatches.length > 0) {
            this.ResultSets.basketballh2hMatches = _data.basketballh2hMatches;
          }

          //Form Matches and this season stats  for both team , 
          if (_data.basketballAllMatches && _data.basketballAllMatches.length > 0) {
            this.ResultSets.FormMatchesListHomeTeam = this._calculationService.getH2HFormMatches(this.selectedHomeTeamId, _data.basketballAllMatches);
            this.ResultSets.FormMatchesListAwayTeam = this._calculationService.getH2HFormMatches(this.selectedAwayTeamId, _data.basketballAllMatches);
            this.ResultSets.Stats = this._calculationService.getH2HStatsforTeam(this.selectedHomeTeamId, this.selectedAwayTeamId, _data.basketballAllMatches);
            this.isStatsAvailable = true;
          }
          else
            this.isStatsAvailable = false;
        }
        this.isLoading = false;
      }, (error) => {
        this.statusMessage = 'Problem in service please try again after some time';
        this.isLoading = false;
      });
  }

  private getTeamsFromServer(contestGroupId) {
    this.isLoading = true;
    let body = { ContestGroupId: contestGroupId };
    this._httpService.getDataFromServer(ApiUrls.BasetballContestTeams, "test", body)
      .subscribe((resultData) => {
        if ((<any>resultData).data && (<any>resultData).data.length > 0) {
          this.ContestTeams = (<any>resultData).data;
          this.isLoading = false;
        }
      }, (error) => {
        this.statusMessage = 'Problem in service please try again after some time';
        this.isLoading = false;
      });
  }
}