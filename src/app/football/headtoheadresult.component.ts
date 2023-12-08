import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { MemoryService } from '../services/memory.service';
import { HttpService } from "../services/httpService";
import { ApiUrls } from "../CommonUtility/apiUrls";
import { LanguageService } from "../services/language.service";
import { ContestHead2HeadModel } from "../BusinessModel/Football/ContestHead2HeadModel";

@Component({
    selector: 'headtoheadresult',
    templateUrl: './headtoheadresult.component.html'
})
export class HeadToHeadResultComponent implements OnChanges {

    isLoading = false;
    HomeTeamName: string = '';
    AwayTeamName: string = '';
    HomeTeamId: number;
    AwayTeamId: number;
    Isform_team2: boolean = false;
    Isform_team1: boolean = true;
    form_team2: string = '';
    form_team1: string = 'active';

    languageKeys: any;
    headtoheadresult: ContestHead2HeadModel;
    statusMessage: string;
    showH2H: boolean;

    @Input() selectedTeamsObj: any;

    constructor(private _headtoheadresultService: HttpService, private _memoryService: MemoryService, private _languageService: LanguageService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["selectedTeamsObj"] != undefined && changes["selectedTeamsObj"].currentValue != undefined && !changes["selectedTeamsObj"].firstChange) {
            this.HomeTeamName = this.selectedTeamsObj.selectedHomeTeamName;
            this.AwayTeamName = this.selectedTeamsObj.selectedAwayTeamName;
            this.HomeTeamId = this.selectedTeamsObj.selectedHomeTeamId;
            this.AwayTeamId = this.selectedTeamsObj.selectedAwayTeamId;
            let _homeTeamId = this.selectedTeamsObj.selectedHomeTeamId;
            let _awayTeamId = this.selectedTeamsObj.selectedAwayTeamId;
            let _contestId = this.selectedTeamsObj.selectedContestGroupId;
            this.getHeadToHeadCompetitorResultFromServer(_contestId, _homeTeamId, _awayTeamId);
            this.showH2H = true;
        }
        else
            this.showH2H = false;
    }

    ngOnInit() {
        this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    }

    getHeadToHeadCompetitorResultFromServer(contestId: string, homeTeamId: string, awayTeamId: string) {
        this.isLoading = true;
        let body = { ContestGroupId: contestId, HomeTeamId: homeTeamId, AwayTeamId: awayTeamId };
        this._headtoheadresultService.getDataFromServer(ApiUrls.FootballCompetitorHead2Head, 'test', body)
            .subscribe((resultData) => {
                this.isLoading = false;
                this.headtoheadresult = (<any>resultData).data;
            }, (error) => {
                this.statusMessage = 'Problem in service please try again after some time';
            });
    }

    HeadToHeadSelect(selectedValue: any) {
        if (selectedValue == "form_team1") {
            this.Isform_team2 = false;
            this.Isform_team1 = true;
            this.form_team2 = "";
            this.form_team1 = "active";
        }
        if (selectedValue == "form_team2") {
            this.Isform_team2 = true;
            this.Isform_team1 = false;
            this.form_team2 = "active";
            this.form_team1 = "";
        }
    }
}
