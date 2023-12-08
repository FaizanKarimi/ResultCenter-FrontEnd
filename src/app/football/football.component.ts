import { Component, ElementRef } from '@angular/core';
import { MemoryService } from '../services/memory.service';
import { CommonService } from '../services/common.service';
import { HttpService } from "../services/httpService";
import { ApiUrls } from "../CommonUtility/apiUrls";
import { ApiResponseMessage } from "../CommonUtility/apiResponseMessage";
import { LanguageService } from '../services/language.service';
import { CountriesModel } from "../BusinessModel/Shared/ICountries";
import { IContestGroupModel } from "../BusinessModel/Shared/ContestGroupModel";
import { FootballEnum } from "../BusinessModel/Football/foot-ball-enum";
import { SportIdEnum } from "../BusinessModel/Shared/sportId-enum";

@Component({
    selector: 'football',
    templateUrl: './football.component.html'
})
export class football {
    IsCountry: boolean;

    //data models
    countriesModelList: CountriesModel[];
    contestGroupModelList: IContestGroupModel[];
    leagueList: any;
    PickerSelectedDate: any = new Date();
    IsContestandCountry: boolean = false;
    IscloseDate: any;
    countryId: any;
    LeagueId: any;
    RoundId: any;
    awayTeamId: any;
    homeTeamId: any;
    awayTeam: any;
    homeTeam: any;
    isDateSelected: boolean;
    filterCountryOpenClose: number;
    filterLeagueOpenClose: number;
    filterDateOpenClose: number;
    roundResultInput: any;
    isResult: boolean = true;
    isLeagueTable: boolean = false;
    Isheadtohead: boolean = false;
    IsStats: boolean = false;
    IsCountrychange: boolean = false;
    activeClass: string = 'Results';
    countryName: string = 'countries';
    showAllNavigation: boolean = false;
    changedCountryId: number;
    status: string;
    ErrorMessage: string;
    isRoundDropDownClose: any;
    isLeagueDropDownClose: any;
    isTeamsDropDownClose: any;
    isHeadToHeadDropDownClose: any;

    languageKeys: any;
    isLoading: boolean;

    // vairables for selected items
    selectedDate: string;
    selectedDateText: string;
    Calenderdate: string;
    selectedCountryName: string;
    selectedCountryId: number;
    selectedContesGrouptName: string;
    selectedContestGroupId: number;
    selectedTeamsObj: number;
    selectedLeagueName: string;
    selectedLeagueId: number;

    constructor(private _httpService: HttpService, private _memoryService: MemoryService, private _commonService: CommonService,
        private _languageService: LanguageService) {
        // this.selectedDateText = 'Today';
        this.selectedLeagueName = 'Leagues';
        this.isDateSelected = true;
        this.selectedCountryName = 'Countries';
    }

    ngOnInit() {
        this._getCountryListFromServer();
        this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
        this.isResult = true;
        let _dateValue = this._memoryService.getFootballDropDownValue(FootballEnum.DateValue);
        let countryId = this._memoryService.getFootballDropDownValue(FootballEnum.CountryId);
        let countrName = this._memoryService.getFootballDropDownValue(FootballEnum.CountryName);
        if (countryId != null && countrName != '')
            this.onCountrySelected(countryId, countrName, true);
        else {
            if (_dateValue != null && _dateValue != '')
                this.onDateSelect(_dateValue);
            else
                this.onDateSelect('Today');
        }
    }

    getCountrySelected(event: any) {
        this._memoryService.saveFootballDropDownValue('Team 1', FootballEnum.HomeTeam);
        this._memoryService.saveFootballDropDownValue('Team 2', FootballEnum.AwayTeam);
        this._memoryService.saveFootballDropDownValue(undefined, FootballEnum.LeagueId);
        this._memoryService.saveFootballDropDownValue(undefined, FootballEnum.RoundId);
        this.countryName = '';
        this.homeTeamId = undefined;
        this.awayTeamId = undefined;
        this._selectResultTab();
    }

    getSelectedCountryId(selectedCountryId: number) {
        this.showAllNavigation = true;
        this.closeDatePicker();
        this.countryId = selectedCountryId;
        this.countryName = '';
        this.changedCountryId = this._commonService.getRandomNumber();
        this._memoryService.saveFootballDropDownValue(0, FootballEnum.ContestGroupId);
        this._memoryService.saveFootballDropDownValue(0, FootballEnum.RoundId);
    }

    onContestSelectFromResult(event: any) {
        this.onCountrySelected(event.countryId, event.countryName, true, event.leagueId, event.leagueName);
    }

    closeDatePicker() {
        if (this.IscloseDate)
            this.IscloseDate = false;
        else
            this.IscloseDate = true;
    }

    getCountryName(event: any) {
        this.selectedCountryName = event;
    }

    getLeagueId(event: any) {
        this.closeDatePicker();
        this.selectedContestGroupId = event;
        this._memoryService.saveFootballDropDownValue(event, FootballEnum.ContestGroupId);
    }

    getRoundId(event: any) {
        this.closeDatePicker();
        this.RoundId = event;
        this.roundResultInput = { LeagueId: this.selectedContestGroupId, RoundId: this.RoundId };
        this._memoryService.saveFootballDropDownValue(event, FootballEnum.RoundId);
    }

    getSelectedTeamsObj(event: any) {
        this.selectedTeamsObj = event;
    }

    dateDropDownClicked(event: any) {
        this.filterCountryOpenClose = this._generateRandomNumber();
        this.filterLeagueOpenClose = this._generateRandomNumber();
    }

    countryDropDownClicked(event: any) {
        this.filterLeagueOpenClose = this._generateRandomNumber();
        this.filterDateOpenClose = this._generateRandomNumber();
    }

    LeagueDropDownClicked(event: any) {
        this.filterDateOpenClose = this._generateRandomNumber();
        this.filterCountryOpenClose = this._generateRandomNumber();
    }

    selectedTab(clickedValue: string) {
        switch (clickedValue) {
            case 'Results':
                this.isLeagueTable = false;
                this.Isheadtohead = false;
                this.IsStats = false;
                this.isResult = true;
                this.activeClass = 'Results';
                break;
            case 'leaguetable':
                this.isResult = false;
                this.isLeagueTable = true;
                this.Isheadtohead = false;
                this.IsStats = false;
                this.activeClass = 'leaguetable';
                break;
            case 'headtohead':
                this.isResult = false;
                this.isLeagueTable = false;
                this.Isheadtohead = true;
                this.IsStats = false;
                this.activeClass = 'headtohead';
                break;
            case 'Stats':
                this.isResult = false;
                this.isLeagueTable = false;
                this.Isheadtohead = false;
                this.IsStats = true;
                this.activeClass = 'Stats';
                break;
            default:
                this.isResult = true;
                this.isLeagueTable = false;
                break;
        }
    }

    private _selectResultTab() {
        if (!this.isResult) {
            this.isLeagueTable = false;
            this.Isheadtohead = false;
            this.IsStats = false;
            this.isResult = true;
            this.activeClass = 'Results';
        }
    }

    private _generateRandomNumber(): number {
        return this._commonService.getRandomNumber();
    }

    // on selection functions
    onDateSelect(_date: string) {
        this.selectedDate = this._commonService.getDate(_date);
        this._removeInMemoryData();
        this.Calenderdate = _date == 'Today' || _date == 'Yesterday' ? '' : _date; //to empty the date field if it is not selected again
        this.selectedDateText = _date == 'Today' ? this.languageKeys.TODAY : _date == 'Yesterday' ? this.languageKeys.YESTERDAY : this.selectedDate;
        this.selectedCountryName = this.languageKeys.COUNTRY;
        this.selectedCountryId = 0;
        this.isDateSelected = true;
        this.IsContestandCountry = false;
        this.IsCountry = false;
        this.showAllNavigation = false;
        this.selectedTab('Results');
        this._memoryService.saveFootballDropDownValue(this.selectedDateText, FootballEnum.DateText);
        this._memoryService.saveFootballDropDownValue(_date, FootballEnum.DateValue);
    }

    onCountrySelected(countryId: number, countryName: string, removeMemory: boolean, leagueId?: number, leagueName?: string) {
        this._clearDateSelection();
        //remove data from memory
        if (!removeMemory) {
            this._removeInMemoryData();
            this.selectedTeamsObj = undefined;
        }
        let _countryName = this._memoryService.getFootballDropDownValue(FootballEnum.CountryName);
        if (countryName != _countryName) {
            this._saveContestGroup(0, '');
        }
        this._memoryService.saveFootballDropDownValue(countryId, FootballEnum.CountryId);
        this._memoryService.saveFootballDropDownValue(countryName, FootballEnum.CountryName);
        this.selectedCountryId = countryId;
        this.selectedCountryName = countryName;
        this.isDateSelected = false;
        this.IsCountry = true;
        if (!leagueId)
            this.BindContestDropDown(this.selectedCountryId, SportIdEnum.Football);
        else
            this.BindContestDropDown(this.selectedCountryId, SportIdEnum.Football, leagueName, leagueId);
    }

    onContestGroupSelected(contestId: number, contestName: string, removeMemory?: boolean) {
        this._saveContestGroup(contestId, contestName);
        this.selectedContestGroupId = contestId;
        this.selectedContesGrouptName = contestName;
        this.showAllNavigation = true;
        this.selectedTab('Results');
        this.IsContestandCountry = true;
        this._removeInMemoryContestData(removeMemory);
    }

    BindContestDropDown(countryId: number, sportId: number, contestGroupName?: string, contestGroupId?: number) {
        let body = { SportId: sportId, CountryId: countryId };
        this._httpService.getDataFromServer(ApiUrls.FootballContestGroup, 'test', body).subscribe(
            (response) => {
                this.status = (<any>response).status;
                if (this.status == ApiResponseMessage.success) {
                    this.contestGroupModelList = (<any>response).data.ContestGroups;
                    if (this.contestGroupModelList != null && this.contestGroupModelList.length > 0) {
                        let _contestId = this._memoryService.getFootballDropDownValue(FootballEnum.ContestGroupId);
                        let _contestName = this._memoryService.getFootballDropDownValue(FootballEnum.ContestGroupName);
                        if (_contestName != null && _contestName != '') {
                            this.onContestGroupSelected(_contestId, _contestName, false);
                        }
                        else {
                            if (contestGroupId != null && contestGroupName != '')
                                this.onContestGroupSelected(contestGroupId, contestGroupName, false);
                            else
                                this.onContestGroupSelected(this.contestGroupModelList[0].ContestGroupId, this.contestGroupModelList[0].ContestGroupName, true);
                        }
                    }
                    else {
                        this.onContestGroupSelected(0, this.languageKeys.TOURNAMENTS_ARE_NOT_AVAILABLE, true);
                    }
                    this.status = '';
                } else this.ErrorMessage = (<any>response).message;
            });
    }

    private _getCountryListFromServer() {
        let body = { SportId: SportIdEnum.Football };
        this._httpService.getDataFromServer(ApiUrls.FootballCountryList, 'test', body)
            .subscribe(
                (response) => {
                    this._bindCountryList(response);
                });
    }

    private _bindCountryList(response: any) {
        this.status = (<any>response).status;
        if (this.status == ApiResponseMessage.success) {
            this.countriesModelList = (<any>response).data.Countries;
            this.status = '';
        } else this.ErrorMessage = (<any>response).message;
    }

    private _clearDateSelection() {
        this.isDateSelected = false;
        this.Calenderdate = undefined;
        this.selectedDateText = this.languageKeys.TODAY;
    }

    private _removeInMemoryData() {
        this._memoryService.saveFootballDropDownValue(0, FootballEnum.CountryId);
        this._memoryService.saveFootballDropDownValue('', FootballEnum.CountryName);
        this._memoryService.saveFootballDropDownValue(0, FootballEnum.ContestGroupId);
        this._memoryService.saveFootballDropDownValue('', FootballEnum.ContestGroupName);
        this._memoryService.saveFootballDropDownValue(0, FootballEnum.RoundId);
        this._memoryService.saveFootballDropDownValue('', FootballEnum.RoundName);
        this._memoryService.saveFootballDropDownValue('', FootballEnum.DateValue);
        this._memoryService.saveFootballDropDownValue('', FootballEnum.HomeTeam);
        this._memoryService.saveFootballDropDownValue('', FootballEnum.AwayTeam);
        this._memoryService.saveFootballDropDownValue(null, FootballEnum.AwayTeamId);
        this._memoryService.saveFootballDropDownValue(null, FootballEnum.HomeTeamId);
    }

    private _removeInMemoryContestData(removeMemory: boolean) {
        if (removeMemory) {
            this._memoryService.saveFootballDropDownValue(0, FootballEnum.RoundId);
            this._memoryService.saveFootballDropDownValue('', FootballEnum.RoundName);
        }
        this._memoryService.saveFootballGroups(null);
        this._memoryService.saveFootballDropDownValue('', FootballEnum.DateValue);
        this._memoryService.saveFootballDropDownValue('', FootballEnum.HomeTeam);
        this._memoryService.saveFootballDropDownValue('', FootballEnum.AwayTeam);
        this._memoryService.saveFootballDropDownValue(null, FootballEnum.AwayTeamId);
        this._memoryService.saveFootballDropDownValue(null, FootballEnum.HomeTeamId);
    }

    private _saveContestGroup(contestId: number, contestName: string) {
        this._memoryService.saveFootballDropDownValue(contestId, FootballEnum.ContestGroupId);
        this._memoryService.saveFootballDropDownValue(contestName, FootballEnum.ContestGroupName);
    }
}