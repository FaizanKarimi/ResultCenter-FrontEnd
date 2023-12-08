import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonService } from '../services/common.service';
import { MemoryService } from '../services/memory.service';
import * as _ from 'lodash';
import { HttpService } from "../services/httpService";
import { ApiUrls } from "../CommonUtility/apiUrls";
import { ApiResponseMessage } from "../CommonUtility/apiResponseMessage";
import { LanguageService } from '../services/language.service';
import { TennisSportOrganization } from "../BusinessModel/Tennis/TennisSportOrganisation";
import { TennisSportOrganizationTypeEnum } from "../BusinessModel/Tennis/TennisSportOrganisationType.enum";
import { SportsOrganizationModel } from "../BusinessModel/Tennis/ISportsOrganizationModel";
import { TennisLeagueList } from "../BusinessModel/Tennis/TennisLeaguesListModel";
import { SportIdEnum } from "../BusinessModel/Shared/sportId-enum";
import { TennisEnum } from "../BusinessModel/Tennis/tennis-enum";
import { TennisOrgNameEnum } from "../BusinessModel/Tennis/tennis-org-name-enum";
import { TennisGenderIdEnum } from "../BusinessModel/Tennis/tennis-genderId-enum";

@Component({
  selector: 'app-tennis',
  templateUrl: './tennis.component.html',
  styleUrls: ['./tennis.component.css']
})
export class TennisComponent implements OnInit {

  ErrorMessage: string = '';

  // data models
  tennisLeagueList: TennisLeagueList[];
  organizationsList: TennisSportOrganization[];

  selectedDate: string;
  isDateSelected: boolean;
  selectedOrgId: number;
  isOrgSelected: boolean;
  selectedContestId: number;
  selectedSportOrgId: number;
  selectedTab: string;
  selectedDateText: string;
  filterDateOpenClose: number;
  filterOrgOpenClose: number;
  filterLeagueOpenClose: number;
  selectedOrgName: string;
  status: string;
  selectedContestText: string;
  languageKeys: any;
  isDrawDropDownClose: any;
  isStatsDropDownClose: any;
  isTeamsDropDownClose: any;
  isContestSelected: boolean;
  Calenderdate: string;

  constructor(private _commonService: CommonService, private _httpService: HttpService, private _memoryService: MemoryService, private _elementRef: ElementRef, private _languageService: LanguageService) {
    this.selectedDateText = 'Today';
    this.isDateSelected = true;
    this.isOrgSelected = false;
    this.isContestSelected = false;
    this.selectedTab = 'Results';
  }

  ngOnInit() {
    this.BindOrgsList(SportIdEnum.Tennis);
    let date = this._memoryService.getTennisDropDownValues(TennisEnum.Date);
    let orgId = this._memoryService.getTennisDropDownValues(TennisEnum.OrgId);
    let orgName = this._memoryService.getTennisDropDownValues(TennisEnum.OrgName);
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    if (orgName != null && orgName != '') {
      this.selectedOrgName = orgName;
      let sportOrg = this._getSportOrganizationObject(orgId, orgName);
      this.onOrgSelected(sportOrg, true);
    }
    else if (date != null && date != '') {
      this.onDateSelect(date);
    }
    else {
      this.selectedOrgName = this.languageKeys.TYPE;
      this._clearDateSelection();
      this.onDateSelect('Today');
    }
  }

  onContestSelectedFromResults(event: any) {
    //saving in memory
    this._saveSelectedContest(event);
    this._clearDateSelection();
    let contestName = event.contestGroupName.toLowerCase();
    let orgName = contestName.indexOf('chs') > 0 ? TennisOrgNameEnum.CHALLENGER : event.orgName;

    this.selectedOrgId = event.SportOrgId;
    this.selectedContestId = event.contestId;
    this.selectedContestText = event.contestGroupName;
    this.selectedOrgName = orgName;
    this.isOrgSelected = true;
    this.isContestSelected = true;
    let genderId = this._getOrgGender(event.orgName);
    let sportOrg = this._getSportOrganizationObject(event.SportOrgId, orgName);
    this.BindLeagueDropDown(sportOrg, event.contestId, event.contestGroupName)
  }

  SelectLeague(event: any) {
    //Saving data to memory
    this._saveSelectedContest(event);

    this.selectedOrgId = event.SportOrgId;
    this.selectedOrgName = event.orgName;
    this.selectedContestId = event.contestId;
    this.selectedContestText = event.contestGroupName;
    this._clearDateSelection();
    this.isOrgSelected = true;
    this.isContestSelected = true;
    this.isDateSelected = false;
  }

  onTabSelect(event: any) {
    this.selectedTab = event;
  }

  // on selection functions
  onDateSelect(_date: string) {
    this._removeInMemoryData();
    this._memoryService.saveTennisDropDownValue(_date, TennisEnum.Date);
    this.selectedDate = this._commonService.getDate(_date);
    this.Calenderdate = _date == 'Today' || _date == 'Yesterday' ? '' : _date; //to empty the date field if it is not selected again
    this.selectedDateText = _date == 'Today' ? this.languageKeys.TODAY : _date == 'Yesterday' ? this.languageKeys.YESTERDAY : this.selectedDate;
    this.isOrgSelected = false;
    this.selectedOrgName = this.languageKeys.TYPE
    this.selectedOrgId = 0;
    this.isDateSelected = true;
    this.selectedTab = 'Results'
  }

  onOrgSelected(sportOrg: TennisSportOrganization, removeMemoryData?: boolean) {
    //Removing already selected data from in memory if already saved data in memory    
    if (!removeMemoryData) this._removeInMemoryData();

    //Checking data in memory.
    let _orgName = this._memoryService.getTennisDropDownValues(TennisEnum.OrgName);
    if (sportOrg.OrgName != _orgName) {
      this._memoryService.saveTennisDropDownValue(0, TennisEnum.ContestGroupId);
      this._memoryService.saveTennisDropDownValue('', TennisEnum.ContestGroupText);
    }

    //Saving data to memory
    this._memoryService.saveTennisDropDownValue(sportOrg.SportOrgId, TennisEnum.OrgId);
    this._memoryService.saveTennisDropDownValue(sportOrg.OrgName, TennisEnum.OrgName);

    this._clearDateSelection();
    this.selectedOrgId = sportOrg.SportOrgId;
    this.selectedOrgName = sportOrg.OrgName;
    this.BindLeagueDropDown(sportOrg);
    this.isOrgSelected = true;
    this.isDateSelected = false;
  }

  onSelectContestGroup(contestId: number, contestText: string) {
    //Saving data to memory
    this._memoryService.saveTennisDropDownValue(contestId, TennisEnum.ContestGroupId);
    this._memoryService.saveTennisDropDownValue(contestText, TennisEnum.ContestGroupText);
    this.selectedContestId = contestId;
    this.selectedContestText = contestText;
    this.isContestSelected = true;
    this.selectedTab = 'Results';
    this._clearRoundSelection();
  }

  // Service Calls
  BindOrgsList(sportId: number) {
    let body = { SportId: sportId };
    this._httpService.getDataFromServer(ApiUrls.TennisOrgsList, 'test', body).subscribe(
      data => {
        this.status = (<any>data).status;
        if (this.status == ApiResponseMessage.success) {
          let _orgList = (<any>data).data;
          this.organizationsList = this._getSportOrgList(_orgList);
          this.status = '';
        } else this.ErrorMessage = (<any>data).message;
      }
    )
  }

  private BindLeagueDropDown(sportOrg: TennisSportOrganization, leagueId?: number, leagueName?: string) {

    let body = { SportId: SportIdEnum.Tennis, SportOrgId: sportOrg.SportOrgId, GenderId: sportOrg.GenderId, SportOrgTypeId: sportOrg.OrgTypeId };
    this._httpService.getDataFromServer(ApiUrls.TennisLeagueList, 'test', body).subscribe(
      (data) => {
        this.status = (<any>data).status;
        if (this.status == ApiResponseMessage.success) {
          this.tennisLeagueList = (<any>data).data;
          this.status = '';
          this.ErrorMessage = '';
          //Checking the contestGroupId is in memory than pass it along else it would be same.
          let contestGroupId = this._memoryService.getTennisDropDownValues(TennisEnum.ContestGroupId);
          let contestGroupText = this._memoryService.getTennisDropDownValues(TennisEnum.ContestGroupText);
          if (contestGroupText != null && contestGroupText != '') {
            this.onSelectContestGroup(contestGroupId, contestGroupText);
          }
          else {
            if (this.tennisLeagueList != null && this.tennisLeagueList.length > 0) {
              if (leagueId == null && leagueName == null) {
                let cName = this.tennisLeagueList[0].LeagueName + ' - ' + this.tennisLeagueList[0].ContestType;
                let cid = this.tennisLeagueList[0].ContestGroupId;
                this.onSelectContestGroup(cid, cName);
              }
              else {
                this.onSelectContestGroup(leagueId, leagueName);
              }
            }
            else {
              this.ErrorMessage = (<any>data).message;
              this.onSelectContestGroup(0, '');
              this.selectedContestText = this.languageKeys.TOURNAMENTS_ARE_NOT_AVAILABLE;
              this.isContestSelected = false;
            }
          }
        }
      });
  }

  // In memory related functions
  private _removeInMemoryData() {
    this._memoryService.saveTennisDropDownValue(0, TennisEnum.SelectedAwayTeamId);
    this._memoryService.saveTennisDropDownValue(0, TennisEnum.SelectedHomeTeamId);
    this._memoryService.saveTennisDropDownValue('', TennisEnum.SelectedAwayTeamName);
    this._memoryService.saveTennisDropDownValue('', TennisEnum.SelectedHomeTeamName);
    this._memoryService.saveTennisDropDownValue('', TennisEnum.RoundName);
    this._memoryService.saveTennisDropDownValue(0, TennisEnum.RoundId);
    this._memoryService.saveTennisDropDownValue(0, TennisEnum.StatsTypeId);
    this._memoryService.saveTennisDropDownValue('', TennisEnum.StatsTypeValue);
    this._memoryService.saveTennisDropDownValue(0, TennisEnum.ContestGroupId);
    this._memoryService.saveTennisDropDownValue('', TennisEnum.ContestGroupText);
    this._memoryService.saveTennisDropDownValue(0, TennisEnum.OrgId);
    this._memoryService.saveTennisDropDownValue('', TennisEnum.OrgName);
  }

  private _saveSelectedContest(event: any) {
    this._memoryService.saveTennisDropDownValue(event.SportOrgId, TennisEnum.OrgId);
    this._memoryService.saveTennisDropDownValue(event.orgName, TennisEnum.OrgName);
    this._memoryService.saveTennisDropDownValue(event.contestId, TennisEnum.ContestGroupId);
    this._memoryService.saveTennisDropDownValue(event.contestGroupName, TennisEnum.ContestGroupText);
  }

  private _clearDateSelection() {
    this.isDateSelected = false;
    this.Calenderdate = undefined;
    this.selectedDateText = this.languageKeys.TODAY;
  }

  private _clearRoundSelection() {
    this._memoryService.saveTennisDropDownValue('', TennisEnum.RoundName);
    this._memoryService.saveTennisDropDownValue(0, TennisEnum.RoundId);

  }

  private _getSportOrgList(orgList: any) {
    let _orgListDBModel = new Array<SportsOrganizationModel>();
    let _orgList = new Array<TennisSportOrganization>();
    //Removing ITF from List
    _orgListDBModel = _.filter(orgList, function (o) {
      return o.SportOrgId != 13;
    });

    _.forEach(_orgListDBModel, (org) => {
      let _orgObj = new TennisSportOrganization();
      _orgObj.OrgName = org.OrgName;
      _orgObj.SportOrgId = org.SportOrgId;
      _orgObj.GenderId = this._getOrgGender(org.OrgName);
      _orgObj.OrgTypeId = TennisSportOrganizationTypeEnum.NON_CHALLENGER;
      _orgList.push(_orgObj);
    });
    // Adding ITF MEN and WOMEN
    _orgList.push(
      {
        SportOrgId: 13,
        OrgName: TennisOrgNameEnum.ITF_Men.toString(),
        GenderId: TennisGenderIdEnum.male,
        OrgTypeId: TennisSportOrganizationTypeEnum.NON_CHALLENGER
      },
      {
        SportOrgId: 13,
        OrgName: TennisOrgNameEnum.ITF_Women.toString(),
        GenderId: TennisGenderIdEnum.female,
        OrgTypeId: TennisSportOrganizationTypeEnum.NON_CHALLENGER
      },
      {
        SportOrgId: 8,
        OrgName: TennisOrgNameEnum.CHALLENGER.toString(),
        GenderId: TennisGenderIdEnum.male,
        OrgTypeId: TennisSportOrganizationTypeEnum.CHALLENGER
      },
    );

    _orgList = _.orderBy(_orgList, 'OrgName', 'Desc');
    return _orgList;
  }

  private _getOrgGender(orgName) {
    let genderId;
    switch (orgName) {
      case TennisOrgNameEnum.ATP:
      case TennisOrgNameEnum.ITF_Men:
      case TennisOrgNameEnum.CHALLENGER:
        genderId = TennisGenderIdEnum.male;
        break;
      case TennisOrgNameEnum.WTA: case TennisOrgNameEnum.ITF_Women:
        genderId = TennisGenderIdEnum.female;
        break;
      default:
        genderId = TennisGenderIdEnum.male;
    }
    return genderId;
  }

  private _getOrgType(orgName) {
    if (orgName == TennisOrgNameEnum.CHALLENGER)
      return TennisSportOrganizationTypeEnum.CHALLENGER
    else
      return TennisSportOrganizationTypeEnum.NON_CHALLENGER;
  }

  private _getSportOrganizationObject(orgId: number, orgName: string) {
    let genderId = this._getOrgGender(orgName);
    let orgTypeId = this._getOrgType(orgName);
    let SportOrganizationObject = new TennisSportOrganization();
    SportOrganizationObject = {
      SportOrgId: orgId,
      OrgName: orgName,
      OrgTypeId: orgTypeId,
      GenderId: genderId
    }
    return SportOrganizationObject;
  }
}
