import { Component, OnInit, SimpleChanges, EventEmitter, Input, Output } from '@angular/core';
import { HttpService } from '../../services/httpService';
import { MemoryService } from '../../services/memory.service';
import { ApiUrls } from '../../CommonUtility/apiUrls';
import { IceHockeyTeamsByContestGroupModel } from '../../BusinessModel/IceHockey/IceHockeyTeamsByContestGroupModel';
import { H2HResultSets } from "../../BusinessModel/IceHockey/H2HResultSets";
import { H2HcalculationService } from "./h2-hcalculation.service";
import { LanguageService } from '../../services/language.service';
import { IceHockeyEnum } from "../../BusinessModel/IceHockey/ice-hockey-enum";

@Component({
  selector: 'app-head-to-head',
  templateUrl: './head-to-head.component.html',
  styleUrls: ['./head-to-head.component.css']
})
export class HeadToHeadComponent implements OnInit {

  isAwayTeamselected: boolean = false
  isHomeTeamSelected: boolean = false;
  isLoading: boolean;
  isH2HShow: boolean;
  toggleHomeTeamClass: string;
  toggleAwayTeamClass: string;
  IceHockeyContestTeams: IceHockeyTeamsByContestGroupModel[];
  SelectedTeamHome: string;
  SelectedTeamAway: string;
  statusMessage: string = 'Loading data, Please wait...';
  selectedHomeTeamId: number;
  selectedAwayTeamId: number;
  selectedContestGroupId: number;
  isHomeActiveTab: boolean;
  isStatsAvailable: boolean;
  languageKeys: any;
  ResultSets: H2HResultSets;

  @Input() leagueId: number;

  constructor(private _httpService: HttpService, private _memoryService: MemoryService, private _calculationService: H2HcalculationService, private _languageService: LanguageService) {
    this.isHomeActiveTab = true;
    this.ResultSets = new H2HResultSets();
  }

  ngOnInit() {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    this.SelectedTeamHome = this.languageKeys.TEAM1;
    this.SelectedTeamAway = this.languageKeys.TEAM2;
    let _homeTeam = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.SelectedHomeTeamName);
    let _awayTeam = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.SelectedAwayTeamName);
    let _homeTeamId = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.SelectedHomeTeamId);
    let _awayTeamId = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.SelectedAwayTeamId);
    if (_homeTeam != '' && _awayTeam != '') {
      this.onAwayTeamSelected(_awayTeamId, _awayTeam);
      this.onHomeTeamSelected(_homeTeamId, _homeTeam);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["leagueId"] != undefined && changes["leagueId"].currentValue != undefined) {
      this.selectedContestGroupId = changes["leagueId"].currentValue;
      this.getContestTeamsFromServer(this.leagueId);
    }
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
      this._memoryService.saveIceHockeyDropDownValue(this.selectedHomeTeamId, IceHockeyEnum.SelectedHomeTeamId);
      this._memoryService.saveIceHockeyDropDownValue(this.selectedAwayTeamId, IceHockeyEnum.SelectedAwayTeamId);
      this._memoryService.saveIceHockeyDropDownValue(this.SelectedTeamHome, IceHockeyEnum.SelectedHomeTeamName);
      this._memoryService.saveIceHockeyDropDownValue(this.SelectedTeamAway, IceHockeyEnum.SelectedAwayTeamName);
      this.getHeadToHeadFromServer(this.selectedContestGroupId, this.selectedHomeTeamId, this.selectedAwayTeamId);
    }
  }

  onTabClicked(tabId: number) {
    if (tabId == 1) {
      this.isHomeActiveTab = true;
    }
    else this.isHomeActiveTab = false;
  }

  getContestTeamsFromServer(contestId: number) {
    this.isLoading = true;
    let body = { ContestGroupId: contestId };
    this._httpService.getDataFromServer(ApiUrls.IceHockeyContestTeams, "test", body)
      .subscribe((resultData) => {
        if ((<any>resultData).data && (<any>resultData).data.length > 0) {
          this.IceHockeyContestTeams = (<any>resultData).data;
          this.isLoading = false;
        }
        else {
          this.isLoading = false;
        }
      }, (error) => {
        this.statusMessage = 'Problem in service please try again after some time';
        this.isLoading = false;
      });
  }

  getHeadToHeadFromServer(contestId: number, homeTeamId: number, awayTeamId: number) {
    this.isLoading = true;
    let body = {
      ContestGroupId: contestId,
      homeTeamId: homeTeamId,
      awayTeamId: awayTeamId
    };
    this._httpService.getDataFromServer(ApiUrls.IceHockeyHeadToHead, "test", body)
      .subscribe((resultData) => {
        if ((<any>resultData).data) {
          this.isH2HShow = true;
          let _data = (<any>resultData).data;

          //Last 6 meetings.
          if (_data.MeetingsMatchesList && _data.MeetingsMatchesList.length > 0) {
            this.ResultSets.MeetingsMatchesList = _data.MeetingsMatchesList;
          }

          //Form Matches and this season stats  for both team , 
          if (_data.AllMatchesList && _data.AllMatchesList.length > 0) {
            this.ResultSets.FormMatchesListHomeTeam = this._calculationService.getH2HFormMatches(this.selectedHomeTeamId, _data.AllMatchesList);
            this.ResultSets.FormMatchesListAwayTeam = this._calculationService.getH2HFormMatches(this.selectedAwayTeamId, _data.AllMatchesList);
            this.ResultSets.Stats = this._calculationService.getH2HStatsforTeam(this.selectedHomeTeamId, this.selectedAwayTeamId, _data.AllMatchesList);
            //this.ResultSets.AwayTeamStats = this._calculationService.getH2HStatsforTeam(this.selectedAwayTeamId, _data.SeasonStatsMatchesList);
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
}
