import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { ApiUrls } from '../CommonUtility/apiUrls';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { HttpService } from "../services/httpService";
import { LanguageService } from "../services/language.service";
import { MemoryService } from "../services/memory.service";
import { ContestGroupStatsModel } from "../BusinessModel/Football/ContestGroupStatsModel";
import { FootballEnum } from "../BusinessModel/Football/foot-ball-enum";

@Component({
    selector: 'stats',
    templateUrl: './stats.component.html'
})
export class StatsComponent {
    statsAvailable: boolean;
    additionalInfoAvailable: boolean;
    bothTeamsAvailable: boolean;
    firstHalfAvailable: boolean;
    goalPerMatchAvailable: boolean;
    matchResultAvailable: boolean;
    selectedRoundName: string;
    selectedRoundId: number;
    contestGroupsList: any;
    isInternational: boolean;
    statusMessage: string;
    stats: ContestGroupStatsModel;
    isLoading = true;
    languageKeys: any;

    @Input() leagueId: number;

    constructor(private _statsService: HttpService, private _memoryService: MemoryService, private _languageService: LanguageService) {
        this.firstHalfAvailable = false;
        this.goalPerMatchAvailable = false;
        this.matchResultAvailable = false;
    }

    ngOnInit() {
        this.languageKeys = this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
        let _contestGroups = this._memoryService.getFootballGroups();
        if (_contestGroups && _contestGroups.length > 0) {
            this.isInternational = true;
            let roundId = this._memoryService.getFootballDropDownValue(FootballEnum.RoundId);
            let roundName = this._memoryService.getFootballDropDownValue(FootballEnum.RoundName);
            this.contestGroupsList = _contestGroups;
            this.onRoundSelected(roundId, roundName);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        let _contestGroups = this._memoryService.getFootballGroups();
        if (typeof this.leagueId !== undefined && (!_contestGroups || _contestGroups.length == 0))
            this.getStatsResultFromServer(this.leagueId);
    }

    onRoundSelected(roundId: number, roundName: string) {
        this.selectedRoundId = roundId;
        this.selectedRoundName = roundName;
        this._memoryService.saveFootballDropDownValue(roundId, FootballEnum.RoundId);
        this._memoryService.saveFootballDropDownValue(roundName, FootballEnum.RoundName);
        this.getStatsResultFromServer(roundId);
    }

    getStatsResultFromServer(contestGroupId: number) {
        this.isLoading = true;
        let body = { ContestGroupId: contestGroupId };
        this._statsService.getDataFromServer(ApiUrls.FootballContestGroupStats, '', body)
            .subscribe((resultData) => {
                this.isLoading = false;
                // this.stats = (<any>resultData).data;
                this.resetStatsFlags();
                this.mapStats((<any>resultData).data)
            }, (error) => {
                this.isLoading = false;
                this.statusMessage = 'Problem in service please try again after some time';
            });
    }

    resetStatsFlags() {
        this.goalPerMatchAvailable = false;
        this.firstHalfAvailable = false;
        this.matchResultAvailable = false;
        this.bothTeamsAvailable = false;
        this.additionalInfoAvailable = false;
        this.statsAvailable = false;
    }
    mapStats(stats: any) {
        if (stats) {
            if (stats.HomeResult != 0 && stats.DrawResult != 0 && stats.AwayResult != 0)
                this.matchResultAvailable = true;
            if (stats.TotalAvg != 0 && stats.HomeAvg != 0 && stats.AwayAvg != 0)
                this.goalPerMatchAvailable = true;
            if (stats.Over05Value1H != 0 && stats.Over15Value1H != 0 && stats.Over25Value1H != 0)
                this.firstHalfAvailable = true;
            if (stats.Highest_BothTeamsToScore1 != 0 && stats.Highest_BothTeamsToScore1 != 0 && stats.Highest_BothTeamsToScore1 != 0)
                this.bothTeamsAvailable = true;
            if (stats.Highest_HighestCleanSheets1 != 0 && stats.Highest_LowestCleanSheets1 != 0 && stats.Highest_HighestFailedToScore1 != 0 && stats.Highest_HighestFailedToScore1 != 0)
                this.additionalInfoAvailable = true;
            if (this.goalPerMatchAvailable || this.firstHalfAvailable || this.matchResultAvailable || this.additionalInfoAvailable)
                this.statsAvailable = true;
            else this.statsAvailable = false;
            this.stats = stats;
        } else
            this.statsAvailable = false;

    }
}
