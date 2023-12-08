import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BasketballEnum } from "../BusinessModel/Basketball/basketball-enum";
import { FootballEnum } from "../BusinessModel/Football/foot-ball-enum";
import { IceHockeyEnum } from "../BusinessModel/IceHockey/ice-hockey-enum";
import { TennisEnum } from "../BusinessModel/Tennis/tennis-enum";
@Injectable()
export class MemoryService {

  footballObject: any = {
    countryName: '',
    countryId: 0,
    ContestGroupName: '',
    contestGroupId: 0,
    dateText: '',
    dateValue: '',
    PointType: 'Completed Matches',
    HomeTeam: '',
    AwayTeam: '',
    HomeTeamId: '0',
    AwayTeamId: '0',
    RoundName: '',
    RoundId: 0
  };

  tennisObject: any = {
    date: '',
    contestGroupId: 0,
    RoundName: '',
    RoundId: 0,
    StatsTypeId: 0,
    StatsTypeValue: '',
    OrgId: 0,
    OrgName: '',
    SelectedHomeTeamId: 0,
    SelectedAwayTeamId: 0,
    SelectedHomeTeamName: '',
    SelectedAwayTeamName: ''
  };

  footballSelectedTab: any = {
    tab: ''
  };

  iceHockeyObject: any = {
    Date: '',
    ContestGroupId: 0,
    ContestGroupText: '',
    RoundName: '',
    RoundId: 0,
    StatsTypeId: 0,
    StatsTypeValue: '',
    CountryId: 0,
    CountryName: '',
    SelectedHomeTeamId: 0,
    SelectedAwayTeamId: 0,
    SelectedHomeTeamName: '',
    SelectedAwayTeamName: '',
  };

  basketballObject: any = {
    Date: '',
    ContestGroupId: 0,
    ContestGroupText: '',
    RoundName: '',
    RoundId: 0,
    StatsTypeId: 0,
    StatsTypeValue: '',
    CountryId: 0,
    CountryName: '',
    SelectedHomeTeamId: 0,
    SelectedAwayTeamId: 0,
    SelectedHomeTeamName: '',
    SelectedAwayTeamName: '',
  };
  contestGroupList: any;
  languageCode: any;

  // navbarValue: boolean = false;
  private subject = new BehaviorSubject(true);
  sub = this.subject.asObservable();
  constructor() {
  }

  saveFootaballMatchTab(tab: string): void {
    this.footballSelectedTab.tab = tab;
  }

  getFootballMatchtab(): string {
    return this.footballSelectedTab.tab;
  }

  saveFootballDropDownValue(value: any, parameterName: any): void {
    switch (parameterName) {
      case FootballEnum.DateText:
        this.footballObject.dateText = value;
        break;
      case FootballEnum.DateValue:
        this.footballObject.dateValue = value;
        break;
      case FootballEnum.CountryName:
        this.footballObject.countryName = value;
        break;
      case FootballEnum.CountryId:
        this.footballObject.countryId = value;
        break;
      case FootballEnum.ContestGroupName:
        this.footballObject.ContestGroupName = value;
        break;
      case FootballEnum.ContestGroupId:
        this.footballObject.contestGroupId = value;
        break;
      case FootballEnum.PointType:
        this.footballObject.PointType = value;
        break;
      case FootballEnum.HomeTeam:
        this.footballObject.HomeTeam = value;
        break;
      case FootballEnum.AwayTeam:
        this.footballObject.AwayTeam = value;
        break;
      case FootballEnum.RoundName:
        this.footballObject.RoundName = value;
        break;
      case FootballEnum.RoundId:
        this.footballObject.RoundId = value;
        break;
      case FootballEnum.HomeTeamId:
        this.footballObject.HomeTeamId = value;
        break;
      case FootballEnum.AwayTeamId:
        this.footballObject.AwayTeamId = value;
        break;
      default:
        break;
    }
  }

  getFootballDropDownValue(parameterName: any): any {
    let value = '';
    switch (parameterName) {
      case FootballEnum.CountryName:
        value = this.footballObject.countryName;
        break;
      case FootballEnum.CountryId:
        value = this.footballObject.countryId;
        break;
      case FootballEnum.ContestGroupName:
        value = this.footballObject.ContestGroupName;
        break;
      case FootballEnum.ContestGroupId:
        value = this.footballObject.contestGroupId;
        break;
      case FootballEnum.DateText:
        value = this.footballObject.dateText;
        break;
      case FootballEnum.DateValue:
        value = this.footballObject.dateValue;
        break;
      case FootballEnum.PointType:
        value = this.footballObject.PointType;
        break;
      case FootballEnum.HomeTeam:
        value = this.footballObject.HomeTeam;
        break;
      case FootballEnum.AwayTeam:
        value = this.footballObject.AwayTeam;
        break;
      case FootballEnum.RoundName:
        value = this.footballObject.RoundName;
        break;
      case FootballEnum.RoundId:
        value = this.footballObject.RoundId;
        break;
      case FootballEnum.HomeTeamId:
        value = this.footballObject.HomeTeamId;
        break;
      case FootballEnum.AwayTeamId:
        value = this.footballObject.AwayTeamId;
        break;
      case FootballEnum.LeagueId:
        value = this.footballObject.LeagueId;
        break;
      case FootballEnum.LeagueName:
        value = this.footballObject.LeagueName;
        break;
      default:
        break;
    }
    return value;
  }

  saveTennisDropDownValue(value: any, parameterName: any): void {
    switch (parameterName) {
      case TennisEnum.Date:
        this.tennisObject.date = value;
        break;
      case TennisEnum.ContestGroupId:
        this.tennisObject.contestGroupId = value;
        break;
      case TennisEnum.ContestGroupText:
        this.tennisObject.ContestGroupText = value;
        break;
      case TennisEnum.RoundName:
        this.tennisObject.RoundName = value;
        break;
      case TennisEnum.RoundId:
        this.tennisObject.RoundId = value;
        break;
      case TennisEnum.StatsTypeId:
        this.tennisObject.StatsTypeId = value;
        break;
      case TennisEnum.StatsTypeValue:
        this.tennisObject.StatsTypeValue = value;
        break;
      case TennisEnum.OrgId:
        this.tennisObject.OrgId = value;
        break;
      case TennisEnum.OrgName:
        this.tennisObject.OrgName = value;
        break;
      case TennisEnum.SelectedHomeTeamId:
        this.tennisObject.SelectedHomeTeamId = value;
        break;
      case TennisEnum.SelectedAwayTeamId:
        this.tennisObject.SelectedAwayTeamId = value;
        break;
      case TennisEnum.SelectedHomeTeamName:
        this.tennisObject.SelectedHomeTeamName = value;
        break;
      case TennisEnum.SelectedAwayTeamName:
        this.tennisObject.SelectedAwayTeamName = value;
        break;
      default:
        break;
    }
  }

  getTennisDropDownValues(parameterName: any): any {
    let value = '';
    switch (parameterName) {
      case TennisEnum.Date:
        value = this.tennisObject.date;
        break;
      case TennisEnum.ContestGroupId:
        value = this.tennisObject.contestGroupId;
        break;
      case TennisEnum.ContestGroupText:
        value = this.tennisObject.ContestGroupText;
        break;
      case TennisEnum.RoundName:
        value = this.tennisObject.RoundName;
        break;
      case TennisEnum.RoundId:
        value = this.tennisObject.RoundId;
        break;
      case TennisEnum.StatsTypeId:
        value = this.tennisObject.StatsTypeId;
        break;
      case TennisEnum.StatsTypeValue:
        value = this.tennisObject.StatsTypeValue;
        break;
      case TennisEnum.OrgId:
        value = this.tennisObject.OrgId;
        break;
      case TennisEnum.OrgName:
        value = this.tennisObject.OrgName;
        break;
      case TennisEnum.SelectedHomeTeamId:
        value = this.tennisObject.SelectedHomeTeamId;
        break;
      case TennisEnum.SelectedAwayTeamId:
        value = this.tennisObject.SelectedAwayTeamId;
        break;
      case TennisEnum.SelectedHomeTeamName:
        value = this.tennisObject.SelectedHomeTeamName;
        break;
      case TennisEnum.SelectedAwayTeamName:
        value = this.tennisObject.SelectedAwayTeamName;
        break;
      default:
        break;
    }
    return value;
  }

  saveIceHockeyDropDownValue(value: any, parameterName: any): void {
    switch (parameterName) {
      case IceHockeyEnum.Date:
        this.iceHockeyObject.date = value;
        break;
      case IceHockeyEnum.ContestGroupId:
        this.iceHockeyObject.contestGroupId = value;
        break;
      case IceHockeyEnum.ContestGroupText:
        this.iceHockeyObject.ContestGroupText = value;
        break;
      case IceHockeyEnum.RoundName:
        this.iceHockeyObject.RoundName = value;
        break;
      case IceHockeyEnum.RoundId:
        this.iceHockeyObject.RoundId = value;
        break;
      case IceHockeyEnum.StatsTypeId:
        this.iceHockeyObject.StatsTypeId = value;
        break;
      case IceHockeyEnum.StatsTypeValue:
        this.iceHockeyObject.StatsTypeValue = value;
        break;
      case IceHockeyEnum.CountryId:
        this.iceHockeyObject.CountryId = value;
        break;
      case IceHockeyEnum.CountryName:
        this.iceHockeyObject.CountryName = value;
        break;
      case IceHockeyEnum.SelectedHomeTeamId:
        this.iceHockeyObject.SelectedHomeTeamId = value;
        break;
      case IceHockeyEnum.SelectedAwayTeamId:
        this.iceHockeyObject.SelectedAwayTeamId = value;
        break;
      case IceHockeyEnum.SelectedHomeTeamName:
        this.iceHockeyObject.SelectedHomeTeamName = value;
        break;
      case IceHockeyEnum.SelectedAwayTeamName:
        this.iceHockeyObject.SelectedAwayTeamName = value;
        break;
      default:
        break;

    }

  }

  getIceHockeyDropDownValues(parameterName: any): any {
    let value = '';
    switch (parameterName) {
      case IceHockeyEnum.Date:
        value = this.iceHockeyObject.date;
        break;
      case IceHockeyEnum.ContestGroupId:
        value = this.iceHockeyObject.contestGroupId;
        break;
      case IceHockeyEnum.ContestGroupText:
        value = this.iceHockeyObject.ContestGroupText;
        break;
      case IceHockeyEnum.RoundName:
        value = this.iceHockeyObject.RoundName;
        break;
      case IceHockeyEnum.RoundId:
        value = this.iceHockeyObject.RoundId;
        break;
      case IceHockeyEnum.StatsTypeId:
        value = this.iceHockeyObject.StatsTypeId;
        break;
      case IceHockeyEnum.StatsTypeValue:
        value = this.iceHockeyObject.StatsTypeValue;
        break;
      case IceHockeyEnum.CountryId:
        value = this.iceHockeyObject.CountryId;
        break;
      case IceHockeyEnum.CountryName:
        value = this.iceHockeyObject.CountryName;
        break;
      case IceHockeyEnum.SelectedHomeTeamId:
        value = this.iceHockeyObject.SelectedHomeTeamId;
        break;
      case IceHockeyEnum.SelectedAwayTeamId:
        value = this.iceHockeyObject.SelectedAwayTeamId;
        break;
      case IceHockeyEnum.SelectedHomeTeamName:
        value = this.iceHockeyObject.SelectedHomeTeamName;
        break;
      case IceHockeyEnum.SelectedAwayTeamName:
        value = this.iceHockeyObject.SelectedAwayTeamName;
        break;
      default:
        break;
    }
    return value;
  }

  saveBasketballDropDownValue(value: any, parameterName: any): void {
    switch (parameterName) {
      case BasketballEnum.Date:
        this.basketballObject.date = value;
        break;
      case BasketballEnum.ContestGroupId:
        this.basketballObject.contestGroupId = value;
        break;
      case BasketballEnum.ContestGroupText:
        this.basketballObject.ContestGroupText = value;
        break;
      case BasketballEnum.RoundName:
        this.basketballObject.RoundName = value;
        break;
      case BasketballEnum.RoundId:
        this.basketballObject.RoundId = value;
        break;
      case BasketballEnum.StatsTypeId:
        this.basketballObject.StatsTypeId = value;
        break;
      case BasketballEnum.StatsTypeValue:
        this.basketballObject.StatsTypeValue = value;
        break;
      case BasketballEnum.CountryId:
        this.basketballObject.CountryId = value;
        break;
      case BasketballEnum.CountryName:
        this.basketballObject.CountryName = value;
        break;
      case BasketballEnum.SelectedHomeTeamId:
        this.basketballObject.SelectedHomeTeamId = value;
        break;
      case BasketballEnum.SelectedAwayTeamId:
        this.basketballObject.SelectedAwayTeamId = value;
        break;
      case BasketballEnum.SelectedHomeTeamName:
        this.basketballObject.SelectedHomeTeamName = value;
        break;
      case BasketballEnum.SelectedAwayTeamName:
        this.basketballObject.SelectedAwayTeamName = value;
        break;
      default:
        break;
    }
  }

  getBasketballDropDownValues(parameterName: any): any {
    let value = '';
    switch (parameterName) {
      case BasketballEnum.Date:
        value = this.basketballObject.date;
        break;
      case BasketballEnum.ContestGroupId:
        value = this.basketballObject.contestGroupId;
        break;
      case BasketballEnum.ContestGroupText:
        value = this.basketballObject.ContestGroupText;
        break;
      case BasketballEnum.RoundName:
        value = this.basketballObject.RoundName;
        break;
      case BasketballEnum.RoundId:
        value = this.basketballObject.RoundId;
        break;
      case BasketballEnum.StatsTypeId:
        value = this.basketballObject.StatsTypeId;
        break;
      case BasketballEnum.StatsTypeValue:
        value = this.basketballObject.StatsTypeValue;
        break;
      case BasketballEnum.CountryId:
        value = this.basketballObject.CountryId;
        break;
      case BasketballEnum.CountryName:
        value = this.basketballObject.CountryName;
        break;
      case BasketballEnum.SelectedHomeTeamId:
        value = this.basketballObject.SelectedHomeTeamId;
        break;
      case BasketballEnum.SelectedAwayTeamId:
        value = this.basketballObject.SelectedAwayTeamId;
        break;
      case BasketballEnum.SelectedHomeTeamName:
        value = this.basketballObject.SelectedHomeTeamName;
        break;
      case BasketballEnum.SelectedAwayTeamName:
        value = this.basketballObject.SelectedAwayTeamName;
        break;
      default:
        break;
    }
    return value;
  }

  sendMessage(sub: boolean) {
    this.subject.next(sub);
  }

  getMessage() {
    return this.subject;
  }

  saveFootballGroups(groups: any) {
    this.contestGroupList = groups;
  }
  getFootballGroups() {
    return this.contestGroupList;
  }

  saveLanguageCode(languageCode: any) {
    this.languageCode = languageCode;
  }

  getLanguageCode() {
    return this.languageCode;
  }
}