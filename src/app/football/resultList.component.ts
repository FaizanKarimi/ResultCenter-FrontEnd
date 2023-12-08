import { Component, OnInit, OnChanges, EventEmitter, Input, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { ApiUrls } from '../CommonUtility/apiUrls';
import { CommonService } from '../services/common.service';
import * as _ from 'lodash';
import { MemoryService } from '../services/memory.service';
import { HttpService } from "../services/httpService";
import { ApiResponseMessage } from "../CommonUtility/apiResponseMessage";
import { Router } from '@angular/router';
import { LanguageService } from "../services/language.service";
import { IContestGroupModel } from "../BusinessModel/Shared/ContestGroupModel";
import { FootballEnum } from "../BusinessModel/Football/foot-ball-enum";
import { LiveSportsService } from '../services/live-sports.service';
import { SportIdEnum } from '../BusinessModel/Shared/sportId-enum';
import { Subscription } from 'rxjs';

@Component({
    selector: 'results',
    templateUrl: 'resultList.component.html'
})

export class ResultListComponent implements OnInit, OnDestroy {
    isMatchesAvailable: boolean;
    languageKeys: any;
    matchesErrorMessage: any;
    private contestGroupId = 0;
    private ngSelectedDate = '';
    private pageIndex = 0;
    private pageSize = 10;
    private selecteDateString: string;
    private liveSportsSubcription: Subscription;

    results: Array<IContestGroupModel> = new Array();
    statusMessage: string = 'Loading data, Please wait...';
    isLoading = true;
    showLoadMoreButton: boolean = true;

    status: string;
    ErrorMessage: string;
    roundId: string;
    leagueId: string;
    countryId: string;
    countryName: string;

    @Input() selectedDate: string;
    @Output() onContestSelectFromResult = new EventEmitter<any>();
    @Output() onLeagueId = new EventEmitter<string>();
    @Output() onSelectedCountryId = new EventEmitter<string>();
    @Output() onCountryName = new EventEmitter<string>();

    constructor(private _httpService: HttpService, private _commonService: CommonService,
        private _memoryService: MemoryService, private _router: Router,
        private _languageService: LanguageService, private _liveSportsService: LiveSportsService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['selectedDate'].isFirstChange()) {
            this.pageIndex = 0;
            this.results = new Array();
            this.isLoading = true;
            this.BindMatchResult(this.selectedDate, this.pageIndex, this.pageSize);
        }
    }

    redirectToAction(matchId: any) {
        this._memoryService.sendMessage(false);
        this._router.navigate(['football/football-matchinfo', matchId]);
    }

    ngOnDestroy() {
        if (this.liveSportsSubcription)
            this.liveSportsSubcription.unsubscribe();
    }

    onLeagueSelected(countryId: any, countryName: any, contestGroupId: any, roundId: any, ContestGroupName: any, leagueId: number, leagueName: string) {
        this._memoryService.saveFootballDropDownValue(countryId, FootballEnum.CountryId);
        let _obj: any;
        if (countryId == 99) {
            this._memoryService.saveFootballDropDownValue(contestGroupId, FootballEnum.RoundId);
            this._memoryService.saveFootballDropDownValue(ContestGroupName, FootballEnum.RoundName);
            _obj = {
                countryId: countryId,
                leagueId: leagueId,
                countryName: countryName,
                leagueName: leagueName
            };
        } else {
            this._memoryService.saveFootballDropDownValue(contestGroupId, FootballEnum.ContestGroupId);
            this._memoryService.saveFootballDropDownValue(ContestGroupName, FootballEnum.ContestGroupName);
            _obj = {
                countryId: countryId,
                leagueId: contestGroupId,
                countryName: countryName,
                leagueName: ContestGroupName
            };
        }

        this.onContestSelectFromResult.emit(_obj);
    }

    ngOnInit() {
        this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
        this.BindMatchResult(this.selectedDate, this.pageIndex, this.pageSize);
        this.liveSportsSubcription = this._liveSportsService.$data.subscribe((sports) => {
            var _footballObj = sports.find(sport => {
                return sport.SportId === SportIdEnum.Football
            })
            let _todayDate = new Date().toLocaleDateString();
            if (_footballObj.IsLive && this.selectedDate == _todayDate) {
                this.BindMatchResult(this.selectedDate, 0, this.pageSize * (this.pageIndex + 1), false, true);
            }
        })
    }

    onScrollDown() {
        this.pageIndex++;
        this.BindMatchResult(this.selectedDate, this.pageIndex, this.pageSize, true);
    }

    private BindMatchResult(formateDate: any, PageIndex: number, PageSize: number, isLoadMore?: boolean, isLive?: boolean) {
        // this.isLoading = true;
        let date = new Date(formateDate);
        formateDate = this._commonService.getFormattedDate(date);
        let body = { SportId: 1, FromDate: formateDate, MatchType: 'All', PageIndex: PageIndex, PageSize: PageSize, IsLive: isLive ? isLive : false };
        this._httpService.getDataFromServer(ApiUrls.FootBallMatchResult, 'test', body)
            .subscribe(
                (response) => {
                    this.status = (<any>response).status;
                    if (this.status == ApiResponseMessage.success) {
                        let data = (<any>response).data;
                        if (data != null) {
                            //for hiding the button of load more
                            if (data.length < PageSize)
                                this.showLoadMoreButton = false;
                            else this.showLoadMoreButton = true;

                            if (isLoadMore) {
                                _.forEach(data, (_item) => {
                                    this.results.push(_item);
                                });
                            }
                            else this.results = data;
                            this.ErrorMessage = '';
                            this.isLoading = false;
                            if (PageIndex == 0 && data.length < 1) {
                                this.isLoading = false;
                                this.matchesErrorMessage = this.languageKeys.MATCHES_ARE_NOT_AVAILABLE;
                                this.isMatchesAvailable = false;
                            }
                            else {
                                this.isLoading = false;
                                this.isMatchesAvailable = true;
                            }
                        }
                    } else {
                        this.ErrorMessage = (<any>response).message;
                        this.isLoading = false;
                        this.matchesErrorMessage = this.languageKeys.MATCHES_ARE_NOT_AVAILABLE;
                        this.isMatchesAvailable = false;
                    }
                });
    }
} 