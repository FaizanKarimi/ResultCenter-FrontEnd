import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from "../../services/httpService";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import { Observable } from 'rxjs/Rx';
import { CommonService } from '../../services/common.service';
import { MemoryService } from '../../services/memory.service';
import { MatchStatusService } from "../../services/match-status.service";
import { LanguageService } from "../../services/language.service";
import { SportIdEnum } from "../../BusinessModel/Shared/sportId-enum";

@Component({
    selector: 'matchinfo',
    templateUrl: './footballmatchinfo.component.html',
    styleUrls: []
})
export class FootballmatchinfoComponent implements OnInit, OnDestroy {

    private timerSubscription: any;
    private contestGroupId = 0;

    matchInfo: any;
    statusMessage: string = 'Loading data, Please wait...';
    isMatchLoading = true;

    Info: any = 'active';
    Stats: any = '';
    Lineups: any = '';
    H2H: any = '';
    Table: any = '';
    IsInfo: boolean = true;
    IsStats: boolean = false;
    isLineups: boolean = false;
    IsH2H: boolean = false;
    IsTable: boolean = false;
    matchid: string;
    form_team1active: any = 'active';
    form_team2active: any = '';
    Isform_team1active = true;
    Isform_team2active = false;
    team1_lineup: any = 'active';
    Isteam1_lineup: boolean = true;
    team2_lineup: any = '';
    Isteam2_lineup: any = false;
    languageKeys: any;

    groupName: string;
    check: string;
    final: string;
    ChekHomeStats: any;
    ChekAwayStats: any;

    constructor(private _matchinfoService: HttpService, private _languageService: LanguageService, private _avRoute: ActivatedRoute, private _matchStatusService: MatchStatusService,
        private _memoryService: MemoryService, private _commonService: CommonService, private _router: Router) {
        if (this._avRoute.snapshot.params["id"])
            this.matchid = this._avRoute.snapshot.params["id"];
    }

    ngOnInit() {
        this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
        if (this.matchid != undefined)
            this.getMatchInfoResultFromServer(this.matchid);
    }

    ngOnDestroy() {
        if (this.timerSubscription)
            this.timerSubscription.unsubscribe();
    }
    backToFootball() {
        this._memoryService.sendMessage(true);
        this._router.navigate(['football']);
    }
    selectedTab(clickedValue: string) {

        this._memoryService.saveFootaballMatchTab(clickedValue);
        if (clickedValue == 'Info') {
            this.IsInfo = true;
            this.IsStats = false;
            this.isLineups = false;
            this.IsH2H = false;
            this.IsTable = false;
            this.Info = 'active';
            this.Stats = '';
            this.Lineups = '';
            this.H2H = '';
            this.Table = '';
        }
        else if (clickedValue == 'Stats') {
            this.IsInfo = false;
            this.IsStats = true;
            this.isLineups = false;
            this.IsH2H = false;
            this.IsTable = false;
            this.Info = '';
            this.Stats = 'active';
            this.Lineups = '';
            this.H2H = '';
            this.Table = '';
        }
        else if (clickedValue == 'Lineups') {
            this.IsInfo = false;
            this.IsStats = false;
            this.isLineups = true;
            this.IsH2H = false;
            this.IsTable = false;
            this.Info = '';
            this.Stats = '';
            this.Lineups = 'active';
            this.H2H = '';
            this.Table = '';
        }
        else if (clickedValue == 'H2H') {
            this.IsInfo = false;
            this.IsStats = false;
            this.isLineups = false;
            this.IsH2H = true;
            this.IsTable = false;
            this.Info = '';
            this.Stats = '';
            this.Lineups = '';
            this.H2H = 'active';
            this.Table = '';
        }
        else if (clickedValue == 'Table') {
            this.IsInfo = false;
            this.IsStats = false;
            this.isLineups = false;
            this.IsH2H = false;
            this.IsTable = true;
            this.Info = '';
            this.Stats = '';
            this.Lineups = '';
            this.H2H = '';
            this.Table = 'active';
        }
    }

    h2hTeamForm(h2hselectedTeam: any) {
        if (h2hselectedTeam == 'form_team1') {
            this.form_team1active = 'active';
            this.form_team2active = '';
            this.Isform_team1active = true;
            this.Isform_team2active = false;
        }
        else if (h2hselectedTeam == 'form_team2') {
            this.form_team2active = 'active';
            this.form_team1active = '';
            this.Isform_team1active = false;
            this.Isform_team2active = true;
        }
    }

    LineUpselected(lineupselected: any) {
        if (lineupselected == 'team1_lineup') {
            this.team1_lineup = 'active';
            this.Isteam1_lineup = true;
            this.team2_lineup = '';
            this.Isteam2_lineup = false;
        }
        else if (lineupselected == 'team2_lineup') {
            this.team1_lineup = '';
            this.Isteam1_lineup = false;
            this.team2_lineup = 'active';
            this.Isteam2_lineup = true;
        }
    }

    getMatchInfoResultFromServer(matchId: string) {
        this.isMatchLoading = true;
        let body = { MatchId: matchId };
        this._matchinfoService.getDataFromServer(ApiUrls.FootballMatchDetailBetway, 'gfdg', body)
            .subscribe((resultData) => {
                this.isMatchLoading = false;
                this.matchInfo = (<any>resultData).data;
                this.ChekHomeStats = this.matchInfo.HomeTeamStatsMarkets;
                this.ChekAwayStats = this.matchInfo.AwayTeamStatsMarkets;

                //If the match is not started then by default it will show the H2H tab.
                let matchStatusId = this.matchInfo.MatchStatusId;
                if (matchStatusId == 6) {
                    this.selectedTab('H2H');
                }
                this.check = 'Group';
                this.final = this.matchInfo.ContestGroupName;
                if (this.final.includes('Group')) {
                    this.groupName = this.final.slice(-7)
                }
                else
                    this.groupName = this.languageKeys.TEAMS;

                //Now the interval will invoke.
                let status = this._matchStatusService.isMatchLive(matchStatusId, SportIdEnum.Football);
                if (status) {
                    let params = { MatchId: matchId, IsLive: true };
                    this.timerSubscription = Observable
                        .interval(this._commonService.getObservableIntervalTimer())
                        .timeInterval()
                        .flatMap(() =>
                            this._matchinfoService.getDataFromServer(ApiUrls.FootballMatchDetailBetway, 'test', body)
                        )
                        .subscribe((resultData) => {
                            this.isMatchLoading = false;
                            this.matchInfo = (<any>resultData).data;

                            this.ChekHomeStats = this.matchInfo.HomeTeamStatsMarkets;
                            this.ChekAwayStats = this.matchInfo.AwayTeamStatsMarkets;
                            //Now the selected tab will be shown as the whole data is coming from the server.
                            let footballMatchInfoTab = this._memoryService.getFootballMatchtab();
                            this.selectedTab(footballMatchInfoTab);

                            this.check = 'Group';
                            this.final = this.matchInfo.ContestGroupName;
                            if (this.final.includes('Group')) {
                                this.groupName = this.final.slice(-7)
                            }
                            else
                                this.groupName = 'Teams';

                        });
                }
                else {
                    if (this.timerSubscription)
                        this.timerSubscription.unsubscribe();
                }
            }, (error) => {
                this.isMatchLoading = false;
                this.statusMessage = 'Problem in service please try again after some time';
            });
    }
}