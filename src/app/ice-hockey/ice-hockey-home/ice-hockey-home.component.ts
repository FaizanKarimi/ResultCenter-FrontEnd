import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonService } from "../../services/common.service";
import { HttpService } from "../../services/httpService";
import { MemoryService } from "../../services/memory.service";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import { ApiResponseMessage } from "../../CommonUtility/apiResponseMessage";
import { LanguageService } from '../../services/language.service';
import { CountriesModel } from "../../BusinessModel/Shared/ICountries";
import { IceHockeyEnum } from "../../BusinessModel/IceHockey/ice-hockey-enum";
import { SportIdEnum } from "../../BusinessModel/Shared/sportId-enum";

@Component({
  selector: 'app-ice-hockey-home',
  templateUrl: './ice-hockey-home.component.html',
  styleUrls: ['./ice-hockey-home.component.css']
})
export class IceHockeyHomeComponent implements OnInit {

  isRoundDropDownClose: number;
  isH2HDropDownClose: number;

  //variables for selections
  selectedDateText: string;
  selectedDate: string;
  Calenderdate: string;
  selectedTab: string;
  selectedCountryName: string;
  selectedCountryId: number;
  selectedContestId: number;
  selectedContestName: string;
  languageKeys: any;

  // Boolean variables
  isDateSelected: boolean;
  IsContestandCountry: boolean;
  IsCountrySelected: boolean;

  //data model varaibles
  coutryList: CountriesModel[];
  contestList: any;

  //Misc Variables
  status: string;
  ErrorMessage: string;
  sportId: number;

  constructor(private _commonService: CommonService, private _httpService: HttpService, private _memoryService: MemoryService, private _languageService: LanguageService) {
    this.BindCountriesList(SportIdEnum.IceHockey);
    this.sportId = SportIdEnum.IceHockey;
  }

  ngOnInit() {
    let _date = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.Date);
    let _countryId = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.CountryId);
    let _countryName = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.CountryName);
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
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
    this._memoryService.saveIceHockeyDropDownValue(date, IceHockeyEnum.Date);
    this.selectedDate = this._commonService.getDate(date);
    this.Calenderdate = date == 'Today' || date == 'Yesterday' ? '' : date; //to empty the date field if it is not selected again
    this.selectedDateText = date == 'Today' ? this.languageKeys.TODAY : date == 'Yesterday' ? this.languageKeys.YESTERDAY : this.selectedDate;
    this.isDateSelected = true;
    this.IsContestandCountry = false;
    this.IsCountrySelected = false;
    this.selectedTab = 'Results';
    this._clearCountrySelection();
  }

  onCountrySelected(countryId: number, countryName: string, removeMemory: boolean, leagueId?: number, leagueName?: string) {
    this.IsCountrySelected = true;
    this._clearDateSelection();
    //remove data from memory
    if (!removeMemory) {
      this._removeInMemoryData();
    }
    let _countryName = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.CountryName);
    if (countryName != _countryName) {
      // this._saveContestGroup(0, '');
      this._memoryService.saveIceHockeyDropDownValue(0, IceHockeyEnum.ContestGroupId);
      this._memoryService.saveIceHockeyDropDownValue('', IceHockeyEnum.ContestGroupText);

    }
    this._memoryService.saveIceHockeyDropDownValue(countryId, IceHockeyEnum.CountryId);
    this._memoryService.saveIceHockeyDropDownValue(countryName, IceHockeyEnum.CountryName);
    this.selectedCountryId = countryId;
    this.selectedCountryName = countryName;
    this.isDateSelected = false;
    this.IsContestandCountry = false;
    if (!leagueId)
      this.BindContestGroupList(SportIdEnum.IceHockey, this.selectedCountryId);
    else
      this.BindContestGroupList(SportIdEnum.IceHockey, this.selectedCountryId, leagueId, leagueName);

  }

  onSelectContestGroup(contestId: number, contestName: string) {
    this._memoryService.saveIceHockeyDropDownValue(contestId, IceHockeyEnum.ContestGroupId);
    this._memoryService.saveIceHockeyDropDownValue(contestName, IceHockeyEnum.ContestGroupText);
    this.selectedContestId = contestId;
    this.selectedContestName = contestName;
    this.selectedTab = 'Results';
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
    this._httpService.getDataFromServer(ApiUrls.IceHockeyCountryList, 'test', body).subscribe(
      data => {
        this.status = (<any>data).status;
        if (this.status == ApiResponseMessage.success) {
          this.coutryList = (<any>data).data.Countries;
          this.status = '';
        } else this.ErrorMessage = (<any>data).message;
      }
    )
  }

  BindContestGroupList(sportId: number, countryId: number, leagueId?: number, leagueName?: string) {
    let body = { SportId: sportId, CountryId: countryId }
    this.contestList = new Array<any>();
    this._httpService.getDataFromServer(ApiUrls.IceHockeyContestList, 'test', body).subscribe(
      data => {
        this.status = (<any>data).status;
        if (this.status == ApiResponseMessage.success && (<any>data).data.ContestGroups != undefined) {
          this.contestList = (<any>data).data.ContestGroups;
          let _contestId = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.ContestGroupId);
          let _contestName = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.ContestGroupText);
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
          this.ErrorMessage = (<any>data).message;
          this.onSelectContestGroup(0, this.languageKeys.TOURNAMENTS_ARE_NOT_AVAILABLE);
          this.IsContestandCountry = false;
        }
      }
    )
  }

  private _removeInMemoryData() {
    this._memoryService.saveIceHockeyDropDownValue(0, IceHockeyEnum.SelectedAwayTeamId);
    this._memoryService.saveIceHockeyDropDownValue(0, IceHockeyEnum.SelectedHomeTeamId);
    this._memoryService.saveIceHockeyDropDownValue('', IceHockeyEnum.SelectedAwayTeamName);
    this._memoryService.saveIceHockeyDropDownValue('', IceHockeyEnum.SelectedHomeTeamName);
    this._memoryService.saveIceHockeyDropDownValue('', IceHockeyEnum.RoundName);
    this._memoryService.saveIceHockeyDropDownValue(0, IceHockeyEnum.RoundId);
    this._memoryService.saveIceHockeyDropDownValue(0, IceHockeyEnum.StatsTypeId);
    this._memoryService.saveIceHockeyDropDownValue('', IceHockeyEnum.StatsTypeValue);
    this._memoryService.saveIceHockeyDropDownValue(0, IceHockeyEnum.ContestGroupId);
    this._memoryService.saveIceHockeyDropDownValue('', IceHockeyEnum.ContestGroupText);
    this._memoryService.saveIceHockeyDropDownValue(0, IceHockeyEnum.CountryId);
    this._memoryService.saveIceHockeyDropDownValue('', IceHockeyEnum.CountryName);

  }

  private _clearDateSelection() {
    this.isDateSelected = false;
    this.Calenderdate = undefined;
    this.selectedDateText = this.languageKeys.TODAY;
  }

  private _clearCountrySelection() {
    this.selectedCountryId = 0;
    this.selectedCountryName = 'Region';
  }
}

