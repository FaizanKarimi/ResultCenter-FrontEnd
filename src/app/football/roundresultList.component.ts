import { Component, OnChanges, Input, Output, SimpleChanges, EventEmitter, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ApiUrls } from '../CommonUtility/apiUrls';
import { MemoryService } from '../services/memory.service';
import * as _ from 'lodash';
import { CommonService } from "../services/common.service";
import { HttpService } from "../services/httpService";
import { Router } from '@angular/router';
import { LanguageService } from "../services/language.service";
import { ContestRoundsModel } from "../BusinessModel/Football/ContestRoundsModel";
import { FootballEnum } from "../BusinessModel/Football/foot-ball-enum";
import { LiveSportsService } from '../services/live-sports.service';
import { SportIdEnum } from '../BusinessModel/Shared/sportId-enum';
import { Subscription } from 'rxjs';

@Component({
    selector: 'round-result',
    templateUrl: './roundresultList.component.html',
})

export class RoundResultListComponent implements OnChanges, OnDestroy, OnInit {
    languageKeys: any;
    private timerSubscription: any;
    isRoundIdExist: boolean = false;
    isLeagueIdExist: boolean = false;
    isLoading = true;
    results: any;
    statusMessage: string;
    roundId: string;
    selectedRoundText: string;
    selectedRoundId: number;
    rounds: ContestRoundsModel[];
    dropDownWidthClass: string;
    MatchesErrorMessage: string;
    liveSportsSubcription: Subscription;
    IsRoundToday: boolean;
    IsAnyLiveMatch: boolean;

    @Input() selectedContestGroupId: any;

    constructor(private _liveSportsService: LiveSportsService, private _httpService: HttpService, private _memoryService: MemoryService, private _elementRef: ElementRef, private _commonService: CommonService, private _router: Router, private _languageService: LanguageService) {
        this.isLoading = false;
        this.dropDownWidthClass = '';
        this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
        this.selectedRoundText = this.languageKeys.ROUNDS;
    }

    ngOnChanges(changes: SimpleChanges) {
        let countryName = this._memoryService.getFootballDropDownValue(FootballEnum.CountryName);
        if (changes["selectedContestGroupId"] != undefined && changes["selectedContestGroupId"].currentValue != undefined) {
            let _leagueId = this._memoryService.getFootballDropDownValue(FootballEnum.ContestGroupId);
            let _roundId = this._memoryService.getFootballDropDownValue(FootballEnum.RoundId);
            if (_leagueId == 0 && _roundId == 0)
                this.getRoundsFromServer(this.selectedContestGroupId);
            else if (_leagueId != 0)
                this.getRoundsFromServer(_leagueId);
            else
                this.getRoundsFromServer(this.selectedContestGroupId);
        }
        if (this.timerSubscription)
            this.timerSubscription.unsubscribe();
    }

    ngOnInit() {
        this.liveSportsSubcription = this._liveSportsService.$data.subscribe((sports) => {
            var _footballObj = sports.find(sport => {
                return sport.SportId === SportIdEnum.Football
            })
            if (_footballObj.IsLive && this.IsAnyLiveMatch) {
                this.getRoundResultFromServer(this.selectedContestGroupId, this.selectedRoundId, true);
            }
        })
    }

    ngOnDestroy() {
        if (this.timerSubscription)
            this.timerSubscription.unsubscribe();
        if (this.liveSportsSubcription)
            this.liveSportsSubcription.unsubscribe();
    }

    redirectToAction(matchId: any) {

        this._memoryService.sendMessage(false);
        this._router.navigate(['football/football-matchinfo', matchId]);
    }

    onRoundSelected(roundId: number, roundText: string) {
        this.selectedRoundId = roundId;
        this.selectedRoundText = roundText != '' ? roundText : 'Rounds';
        this._memoryService.saveFootballDropDownValue(this.selectedRoundId, FootballEnum.RoundId);
        this._memoryService.saveFootballDropDownValue(this.selectedRoundText, FootballEnum.RoundName);
        this.isLoading = true;
        this.getRoundResultFromServer(this.selectedContestGroupId, this.selectedRoundId);

        if (this.timerSubscription)
            this.timerSubscription.unsubscribe();
    }

    getRoundResultFromServer(leagueId: string, contestRoundId: number, isLive?: boolean) {
        let body = { ContestGroupId: leagueId, ContestGroupRoundId: contestRoundId, IsLive: isLive ? isLive : false };
        this._httpService.getDataFromServer(ApiUrls.FootBallMatchesByLeagueRound, "testt", body)
            .subscribe((response) => {
                let data = (<any>response).data;
                if (data != null && data.length > 0) {
                    this.results = data;
                    this.isLoading = false;
                    this.IsAnyLiveMatch = this._commonService.checkTodayMatches(SportIdEnum.Football, data[0].Matches);
                }
                else {
                    this.isLoading = false;
                    this.results = null;
                    this.MatchesErrorMessage = this.languageKeys.MATCHES_ARE_NOT_AVAILABLE;
                    this.IsAnyLiveMatch = false;
                }
            }, (error) => {
                this.isLoading = false;
                this.statusMessage = 'Problem in service please try again after some time';
            });
    }

    getRoundsFromServer(leagueId: string) {
        let body = { ContestGroupId: leagueId };
        this.isLoading = true;
        this._httpService.getDataFromServer(ApiUrls.FootballContestRounds, 'tes', body)
            .subscribe((resultData) => {
                this.isLoading = false;
                this.rounds = (<any>resultData).data;
                if (this.rounds != null && this.rounds.length > 0) {
                    let countryId = this._memoryService.getFootballDropDownValue(FootballEnum.CountryId);
                    if (countryId == 99) {
                        this._memoryService.saveFootballGroups(this.rounds);
                        let roundId = this._memoryService.getFootballDropDownValue(FootballEnum.RoundId);
                        let roundName = this._memoryService.getFootballDropDownValue(FootballEnum.RoundName);
                        if (roundId != 0)
                            this.onRoundSelected(roundId, roundName);
                        else
                            this._bindRoundData();
                    }
                    else {
                        this._memoryService.saveFootballGroups(null);
                        let roundId = this._memoryService.getFootballDropDownValue(FootballEnum.RoundId);
                        let roundName = this._memoryService.getFootballDropDownValue(FootballEnum.RoundName);
                        if (roundName != null || roundName != '') {
                            this.roundId = roundId;
                            let round = _.find(this.rounds, function (item) {
                                return item.Round == roundName;
                            });

                            if (round != null) {
                                _.forEach(this.rounds, function (item) {
                                    item.IsSelected = 0;
                                });
                                this.onRoundSelected(round.ContestGroupRoundId, round.Round);
                            }
                            else
                                this._bindRoundData();
                        }
                        else
                            this._bindRoundData();
                    }
                }
                else {
                    this.onRoundSelected(0, this.languageKeys.ROUNDS_ARE_NOT_AVAILABLE);
                }
            }, (error) => {
                this.isLoading = false;
                this.statusMessage = 'Problem in service please try again after some time';
            });
    }

    private _bindRoundData() {
        let round = _.find(this.rounds, function (item) {
            return item.IsSelected == 1;
        });
        //if all the league matches are finished then show the last round as selected.
        if (round == undefined) {
            this.rounds[this.rounds.length - 1].IsSelected = 1;
            this.onRoundSelected(this.rounds[this.rounds.length - 1].ContestGroupRoundId, this.rounds[this.rounds.length - 1].Round);
        } else this.onRoundSelected(round.ContestGroupRoundId, round.Round);
    }
}
