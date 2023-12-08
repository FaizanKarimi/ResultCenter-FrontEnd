import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { MemoryService } from '../services/memory.service';
import { HttpService } from "../services/httpService";
import { ApiUrls } from "../CommonUtility/apiUrls";
import { LanguageService } from "../services/language.service";
import { TeamsModel } from "../BusinessModel/Shared/TeamsModel";
import { FootballEnum } from "../BusinessModel/Football/foot-ball-enum";


@Component({
    selector: 'headtohead',
    templateUrl: './headtohead.component.html',
})
export class HeadToHeadComponent {
    selectedCountestGroupName: any;
    contestGroupsList: any;
    isInternational: boolean;
    isAwayTeamselected: boolean = false
    isHomeTeamSelected: boolean = false;
    SelectedTeamHome: string;
    SelectedTeamAway: string;
    statusMessage: string = 'Loading data, Please wait...';
    isLoading = true;

    contestTeams: TeamsModel[];
    selectedHomeTeamId: number;
    selectedAwayTeamId: number;
    selectedContestGroupId: number;
    selectedTeamsObj: any;
    languageKeys: any;

    @Input() leagueId: number;
    @Output() onSelectedTeamsObj = new EventEmitter<any>();

    constructor(private _httpService: HttpService, private _memoryService: MemoryService, private _languageService: LanguageService) {
        this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
        this.SelectedTeamHome = this.languageKeys.TEAM1;
        this.SelectedTeamAway = this.languageKeys.TEAM2;
    }

    ngOnChanges(changes: SimpleChanges) {
        let _contestGroups = this._memoryService.getFootballGroups();
        if (_contestGroups && _contestGroups.length > 0) {
            this.isInternational = true;
            let roundId = this._memoryService.getFootballDropDownValue(FootballEnum.RoundId);
            let roundName = this._memoryService.getFootballDropDownValue(FootballEnum.RoundName);
            this.contestGroupsList = _contestGroups;
            this.onContestGroupSelected(roundId, roundName);
        }
        else
            if (changes["leagueId"] != undefined && changes["leagueId"].currentValue != undefined) {
                this.getContestTeamsFromServer(this.leagueId);
            }
    }

    onContestGroupSelected(contestGroupId, contestGroupName) {
        this.SelectedTeamHome = this.languageKeys.TEAM1;
        this.SelectedTeamAway = this.languageKeys.TEAM2;
        this.selectedContestGroupId = contestGroupId;
        this.selectedCountestGroupName = contestGroupName;
        this._memoryService.saveFootballDropDownValue(contestGroupId, FootballEnum.RoundId);
        this._memoryService.saveFootballDropDownValue(contestGroupName, FootballEnum.RoundName);
        this.getContestTeamsFromServer(contestGroupId);
        this.isHomeTeamSelected = this.isAwayTeamselected = false;
        this.onSelectedTeamsObj.emit(null);
    }

    onHomeTeamSelected(homeTeamId: any, teamName: any) {
        this.selectedHomeTeamId = homeTeamId;
        this.SelectedTeamHome = teamName;
        this.isHomeTeamSelected = true;
        this._emitSelectedTeamObj();
    }

    onAwayTeamSelected(AwayTeamId: any, teamName: any) {
        this.selectedAwayTeamId = AwayTeamId;
        this.SelectedTeamAway = teamName;
        this.isAwayTeamselected = true;
        this._emitSelectedTeamObj();
    }

    private _emitSelectedTeamObj() {
        if (this.isHomeTeamSelected && this.isAwayTeamselected) {
            if (!this.isInternational) {
                this.selectedTeamsObj = {
                    selectedContestGroupId: this.leagueId,
                    selectedHomeTeamId: this.selectedHomeTeamId,
                    selectedHomeTeamName: this.SelectedTeamHome,
                    selectedAwayTeamId: this.selectedAwayTeamId,
                    selectedAwayTeamName: this.SelectedTeamAway
                };
            }
            else this.selectedTeamsObj = {
                selectedContestGroupId: this.selectedContestGroupId,
                selectedHomeTeamId: this.selectedHomeTeamId,
                selectedHomeTeamName: this.SelectedTeamHome,
                selectedAwayTeamId: this.selectedAwayTeamId,
                selectedAwayTeamName: this.SelectedTeamAway
            };

            this.onSelectedTeamsObj.emit(this.selectedTeamsObj);
            this._memoryService.saveFootballDropDownValue(this.selectedHomeTeamId, FootballEnum.HomeTeamId);
            this._memoryService.saveFootballDropDownValue(this.selectedAwayTeamId, FootballEnum.AwayTeamId);
            this._memoryService.saveFootballDropDownValue(this.SelectedTeamHome, FootballEnum.HomeTeam);
            this._memoryService.saveFootballDropDownValue(this.SelectedTeamAway, FootballEnum.AwayTeam);
        }
    }

    getContestTeamsFromServer(contestId: number) {
        let body = { ContestGroupId: contestId };
        this._httpService.getDataFromServer(ApiUrls.FootballContestTeams, "test", body)
            .subscribe((resultData) => {
                this.contestTeams = (<any>resultData).data;
            }, (error) => {
                this.statusMessage = 'Problem in service please try again after some time';
            });
    }
}
