import { Component, OnInit, OnChanges, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { MemoryService } from '../services/memory.service';
import { HttpService } from "../services/httpService";
import { ApiUrls } from "../CommonUtility/apiUrls";
import { LanguageService } from "../services/language.service";
import { FootballEnum } from "../BusinessModel/Football/foot-ball-enum";

@Component({
    selector: 'leaguetable',
    templateUrl: './leaguetable.component.html',
})
export class LeagueTableComponent implements OnInit {
    private homeSelectedDate: string;
    private pointType = '3';

    statusMessage: string = 'Loading data, Please wait...';
    isLoading = true;
    leagueSelected: string;
    leaguetabledata: any;
    languageKeys: any;
    isInternational: boolean;
    contestGroupsList: any;
    selectedRoundId: number;
    selectedRoundName: string;

    @Input() leagueId: number;

    constructor(private _httpService: HttpService, private _memoryService: MemoryService, private _languageService: LanguageService) {
        this.isInternational = false;
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
        } else {
            this.leagueSelected = this._memoryService.getFootballDropDownValue('PointType');
            this.getLeagueTableByTypeId(this.leagueSelected);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
    }
    getLeagueTableByTypeId(pointType: string) {
        this._memoryService.saveFootballDropDownValue(pointType, 'PointType');
        switch (pointType) {
            case 'Home':
                this.getLeagueTableFromServer(this.leagueId, '1');
                this.leagueSelected = this.languageKeys.HOME;
                break;
            case 'Away':
                this.getLeagueTableFromServer(this.leagueId, '2');
                this.leagueSelected = this.languageKeys.AWAY;
                break;
            case 'Completed Matches':
                this.getLeagueTableFromServer(this.leagueId, '3');
                this.leagueSelected = this.languageKeys.COMPLETED_MATCHES;
                break;
            default:
                break;
        }
    }

    onRoundSelected(roundId: number, roundName: string) {
        this.selectedRoundId = roundId;
        this.selectedRoundName = roundName;
        this._memoryService.saveFootballDropDownValue(roundId, FootballEnum.RoundId);
        this._memoryService.saveFootballDropDownValue(roundName, FootballEnum.RoundName);
        this.getLeagueTableFromServer(roundId, '3');
    }

    getLeagueTableFromServer(contestGroupId: number, pointType: string) {
        this.isLoading = true;
        let body = { ContestGroupId: contestGroupId };
        this._httpService.getDataFromServer(ApiUrls.FootBallLeagueTable, 'test', body)
            .subscribe((resultData) => {
                this.isLoading = false;
                this.pointType = pointType;
                this.leaguetabledata = (<any>resultData).data;

            }, (error) => {
                this.isLoading = false;
                this.statusMessage = 'Problem in service please try again after some time';
            });
    }
}
