import { Component, OnInit } from '@angular/core';
import { MemoryService } from "../../services/memory.service";
import { HttpService } from "../../services/httpService";
import { CommonService } from "../../services/common.service";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import { ApiResponseMessage } from "../../CommonUtility/apiResponseMessage";
import { LanguageService } from '../../services/language.service';
import { CountriesModel } from "../../BusinessModel/Shared/ICountries";
import { BasketballEnum } from "../../BusinessModel/Basketball/basketball-enum";
import { SportIdEnum } from "../../BusinessModel/Shared/sportId-enum";

@Component({
  selector: 'basktet-ball-home',
  templateUrl: './basktet-ball-home.component.html',
  styleUrls: ['./basktet-ball-home.component.css']
})
export class BasktetBallHomeComponent implements OnInit {

  //variables for selections
  selectedDateText: string;
  selectedDate: string;
  Calenderdate: string;
  selectedTab: string;
  selectedCountryName: string;
  selectedCountryId: number;
  selectedContestId: number;
  selectedContestName: string;

  // Boolean variables
  isDateSelected: boolean;
  IsContestandCountry: boolean;
  isCountrySelected: boolean;

  //data model varaibles
  countryList: CountriesModel[];
  contestList: any;

  //Misc Variables
  status: string;
  ErrorMessage: string;
  languageKeys: any;

  constructor(private _commonService: CommonService, private _httpService: HttpService, private _memoryService: MemoryService, private _languageService: LanguageService) {
    this.BindCountriesList(SportIdEnum.Basketball);
  }

  ngOnInit() {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    let _date = this._memoryService.getBasketballDropDownValues(BasketballEnum.Date);
    let _countryId = this._memoryService.getBasketballDropDownValues(BasketballEnum.CountryId);
    let _countryName = this._memoryService.getBasketballDropDownValues(BasketballEnum.CountryName);
    if (_countryName != null && _countryName != '') {
      this.onCountrySelected(_countryId, _countryName, true);
    }
    else if (_date != null && _date != '') {
      this.onDateSelect(_date);
    }
    else {
      this._clearCountrySelection();
      this._clearDateSelection();
      this.onDateSelect('Today');
    }
  }

  //onSelection functions
  onDateSelect(date: string) {
    this._removeInMemoryData();
    this._memoryService.saveBasketballDropDownValue(date, BasketballEnum.Date);
    this.selectedDate = this._commonService.getDate(date);
    this.Calenderdate = date == 'Today' || date == 'Yesterday' ? '' : date; //to empty the date field if it is not selected again
    this.selectedDateText = date == 'Today' ? this.languageKeys.TODAY : date == 'Yesterday' ? this.languageKeys.YESTERDAY : this.selectedDate;
    this.isDateSelected = true;
    this.IsContestandCountry = false;
    this.isCountrySelected = false;
    this.selectedTab = 'Results';
    this._clearCountrySelection();
  }

  onCountrySelected(countryId: number, countryName: string, removeMemory: boolean, leagueId?: number, leagueName?: string) {
    this._clearDateSelection();
    //remove data from memory
    if (!removeMemory) {
      this._removeInMemoryData();
    }
    let _countryName = this._memoryService.getBasketballDropDownValues(BasketballEnum.CountryName);
    if (countryName != _countryName) {
      // this._saveContestGroup(0, '');
      this._memoryService.saveBasketballDropDownValue(0, BasketballEnum.ContestGroupId);
      this._memoryService.saveBasketballDropDownValue('', BasketballEnum.ContestGroupText);

    }
    this._memoryService.saveBasketballDropDownValue(countryId, BasketballEnum.CountryId);
    this._memoryService.saveBasketballDropDownValue(countryName, BasketballEnum.CountryName);
    this.selectedCountryId = countryId;
    this.selectedCountryName = countryName;
    this.isDateSelected = false;
    this.IsContestandCountry = false;
    this.isCountrySelected = true;
    if (!leagueId)
      this.BindContestGroupList(SportIdEnum.Basketball, this.selectedCountryId);
    else
      this.BindContestGroupList(SportIdEnum.Basketball, this.selectedCountryId, leagueId, leagueName);

  }

  onSelectContestGroup(contestId: number, contestName: string) {
    this._memoryService.saveBasketballDropDownValue(contestId, BasketballEnum.ContestGroupId);
    this._memoryService.saveBasketballDropDownValue(contestName, BasketballEnum.ContestGroupText);
    this.selectedContestId = contestId;
    this.selectedContestName = contestName;
    this.selectedTab = 'Results';
    this.isDateSelected = false;
    this.IsContestandCountry = true;
  }

  onTabSelect(event: any) {
    this.selectedTab = event;
  }
  onContestSelectedFromResults(event: any) {
    this.onCountrySelected(event.countryId, event.countryName, true, event.contestId, event.contestName);
  }

  //DropDown Binding functions
  BindCountriesList(sportId: number) {
    let body = { SportId: sportId };
    this._httpService.getDataFromServer(ApiUrls.BasketballCountryList, 'test', body).subscribe(
      data => {
        this.status = (<any>data).status;
        if (this.status == ApiResponseMessage.success) {
          this.countryList = (<any>data).data;
          this.status = '';
        } else this.ErrorMessage = (<any>data).message;
      }
    )
  }

  BindContestGroupList(sportId: number, countryId: number, leagueId?: number, leagueName?: string) {
    let body = { SportId: sportId, CountryId: countryId }
    this.contestList = new Array<any>();
    this._httpService.getDataFromServer(ApiUrls.BasketballContestList, 'test', body).subscribe(
      data => {
        this.status = (<any>data).status;
        if (this.status == ApiResponseMessage.success && (<any>data).data != undefined) {
          this.contestList = (<any>data).data;
          if (this.contestList.length > 0) {
            let _contestId = this._memoryService.getBasketballDropDownValues(BasketballEnum.ContestGroupId);
            let _contestName = this._memoryService.getBasketballDropDownValues(BasketballEnum.ContestGroupText);
            if (_contestName != null && _contestName != '') {
              this.onSelectContestGroup(_contestId, _contestName);
            } else
              if (!leagueId) {
                this.onSelectContestGroup(this.contestList[0].ContestGroupId, this.contestList[0].ContestGroupName);
              }
              else {
                this.onSelectContestGroup(leagueId, leagueName);
              }
          }
          else {
            this.onSelectContestGroup(0, this.languageKeys.TOURNAMENTS_ARE_NOT_AVAILABLE)
            this.IsContestandCountry = false;
          }
        }
        else {
          this.ErrorMessage = (<any>data).message;
          this.onSelectContestGroup(0, this.languageKeys.TOURNAMENTS_ARE_NOT_AVAILABLE);
          this.IsContestandCountry = false;
        }
      }
    )
  }

  private _removeInMemoryData() {
    this._memoryService.saveBasketballDropDownValue(0, BasketballEnum.SelectedAwayTeamId);
    this._memoryService.saveBasketballDropDownValue(0, BasketballEnum.SelectedHomeTeamId);
    this._memoryService.saveBasketballDropDownValue('', BasketballEnum.SelectedAwayTeamName);
    this._memoryService.saveBasketballDropDownValue('', BasketballEnum.SelectedHomeTeamName);
    this._memoryService.saveBasketballDropDownValue('', BasketballEnum.RoundName);
    this._memoryService.saveBasketballDropDownValue(0, BasketballEnum.RoundId);
    this._memoryService.saveBasketballDropDownValue(0, BasketballEnum.StatsTypeId);
    this._memoryService.saveBasketballDropDownValue('', BasketballEnum.StatsTypeValue);
    this._memoryService.saveBasketballDropDownValue(0, BasketballEnum.ContestGroupId);
    this._memoryService.saveBasketballDropDownValue('', BasketballEnum.ContestGroupText);
    this._memoryService.saveBasketballDropDownValue(0, BasketballEnum.CountryId);
    this._memoryService.saveBasketballDropDownValue('', BasketballEnum.CountryName);

  }

  private _clearDateSelection() {
    this.isDateSelected = false;
    this.Calenderdate = undefined;
    this.selectedDateText = this.languageKeys.TODAY;
  }

  private _clearCountrySelection() {
    this.selectedCountryId = 0;
    this.selectedCountryName = this.languageKeys.REGION;
  }

}
