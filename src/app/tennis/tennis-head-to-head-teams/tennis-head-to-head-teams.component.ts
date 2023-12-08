import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, ElementRef } from '@angular/core';
import { ApiUrls } from '../../CommonUtility/apiUrls';
import { MemoryService } from '../../services/memory.service';
import { CommonService } from "../../services/common.service";
import { HttpService } from "../../services/httpService";
import * as _ from 'lodash';
import { TeamsModel } from "../../BusinessModel/Shared/TeamsModel";
import { TennisEnum } from "../../BusinessModel/Tennis/tennis-enum";
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-tennis-head-to-head-teams',
  templateUrl: './tennis-head-to-head-teams.component.html',
  styleUrls: ['./tennis-head-to-head-teams.component.css']
})
export class TennisHeadToHeadTeamsComponent implements OnInit {
  isLoading = true;
  statusMessage: string = 'Loading data, Please wait...';
  homeSearchText: string = '';
  awaySearchText: string = '';
  contestTeams: TeamsModel[];
  homeTeamDropDown: string;
  awayTeamDropDown: string;
  selectedHomeTeamName: string;
  selectedAwayTeamName: string;
  selectedHomeTeamId: number;
  selectedAwayTeamId: number;
  isHomeSelected: boolean;
  isAwaySelected: boolean;
  languageKeys: any;

  @Input() selectedOrgId: number;
  @Input() SelectedContestId: number;
  @Output() onselectedTeamsObj = new EventEmitter<object>();

  constructor(private _languageService: LanguageService, private _httpService: HttpService, private _memoryService: MemoryService, private _commonService: CommonService, private _elementRef: ElementRef) {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    this.homeTeamDropDown = 'hide';
    this.awayTeamDropDown = 'hide';
    this.selectedHomeTeamName = this.languageKeys.PLAYER1;
    this.selectedAwayTeamName = this.languageKeys.PLAYER2;
    this.isHomeSelected = false;
    this.isAwaySelected = false;
    this.homeSearchText = this.languageKeys.PLAYER1;
    this.awaySearchText = this.languageKeys.PLAYER2;
  }
  ngOnInit() {
    //Checking if the teams are already selected and saved in memory.
    let _homeTeamId = this._memoryService.getTennisDropDownValues(TennisEnum.SelectedHomeTeamId);
    let _awayTeamId = this._memoryService.getTennisDropDownValues(TennisEnum.SelectedAwayTeamId);
    let _homeTeamName = this._memoryService.getTennisDropDownValues(TennisEnum.SelectedHomeTeamName);
    let _awayTeamName = this._memoryService.getTennisDropDownValues(TennisEnum.SelectedAwayTeamName);
    if (_homeTeamName != '' && _awayTeamName != '') {
      //Bind the team names from in memory
      this.onHomeTeamSelected(_homeTeamId, _homeTeamName);
      this.onAwayTeamSelected(_awayTeamId, _awayTeamName);

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['SelectedContestId'] != undefined && changes['SelectedContestId'].currentValue != undefined)
      this.getContestPlayersFromServer(this._memoryService.getTennisDropDownValues(TennisEnum.OrgId))
  }


  onHomeTeamSelected(selectedHomeTeamId: number, stname: string) {
    this.homeSearchText = stname;
    if (selectedHomeTeamId != this.selectedHomeTeamId) {
      this.selectedHomeTeamId = selectedHomeTeamId;
      this.selectedHomeTeamName = stname;
      this.isHomeSelected = true;
      this.emitSelectedObj();
    }
  }

  onAwayTeamSelected(selectedAwayTeamId: number, stname: string) {
    this.awaySearchText = stname;
    if (this.selectedAwayTeamId != selectedAwayTeamId) {
      this.selectedAwayTeamId = selectedAwayTeamId;
      this.selectedAwayTeamName = stname;
      this.isAwaySelected = true;
      this.emitSelectedObj();
    }
  }

  emitSelectedObj() {
    if (this.isHomeSelected && this.isAwaySelected) {
      let obj = {
        selectedHomeTeamId: this.selectedHomeTeamId,
        selectedAwayTeamId: this.selectedAwayTeamId,
        selectedHomeTeamName: this.selectedHomeTeamName,
        selectedAwayTeamName: this.selectedAwayTeamName,
      };
      this._memoryService.saveTennisDropDownValue(this.selectedHomeTeamId, TennisEnum.SelectedHomeTeamId);
      this._memoryService.saveTennisDropDownValue(this.selectedAwayTeamId, TennisEnum.SelectedAwayTeamId);
      this._memoryService.saveTennisDropDownValue(this.selectedHomeTeamName, TennisEnum.SelectedHomeTeamName);
      this._memoryService.saveTennisDropDownValue(this.selectedAwayTeamName, TennisEnum.SelectedAwayTeamName);
      this.onselectedTeamsObj.emit(obj);
      this.homeSearchText = this.selectedHomeTeamName;
      this.awaySearchText = this.selectedAwayTeamName;
    }
  }

  onHomeTouched(event: any) {
    // this.homeSearchText = '';
    if (!this.isHomeSelected)
      this.homeSearchText = '';
  }


  onAwayTouched(event: any) {
    // this.awaySearchText = '';
    if (!this.isAwaySelected)
      this.awaySearchText = '';
  }

  getContestPlayersFromServer(SportOrgaId: number) {
    let body = { SportOrgId: SportOrgaId };
    this._httpService.getDataFromServer(ApiUrls.TennisPlayers, "test", body)
      .subscribe((resultData) => {
        let _data = (<any>resultData).data;
        //give space after coma
        if (_data != null && _data.length > 0) {
          this.contestTeams = (<any>resultData).data;
        }
      }, (error) => {
        this.statusMessage = 'Problem in service please try again after some time';
      });
  }
}
