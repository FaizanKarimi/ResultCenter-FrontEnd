import { Injectable } from '@angular/core';
import { LanguageService } from "./language.service";
import { SportIdEnum } from '../BusinessModel/Shared/sportId-enum';
import { FootballMatchStatusEnum } from '../BusinessModel/Football/FootballMatchStatusEnum.enum';
import { TennisMatchStatusEnum } from '../BusinessModel/Tennis/TennisMatchStatusEnum.enum';
import { BasketBallMatchStatusEnum } from '../BusinessModel/Basketball/basketball-match-status-enum';
import { IceHockeyMatchStatusEnum } from '../BusinessModel/IceHockey/IceHockeyMatchStatusEnum.enum';
import * as _ from 'lodash';

@Injectable()
export class CommonService {

  constructor(private _languageService: LanguageService) { }

  getDate(type: string) {
    let date = new Date();
    switch (type) {
      case 'Today':
        return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear();
      case 'Yesterday':
        date.setDate(date.getDate() - 1);
        return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear();
      case 'Selected':
        return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear();
      default:
        let selectedDate = new Date(type);
        return selectedDate.toLocaleDateString();
    }
  }

  getFormattedDate(date: Date) {
    return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear();
  }

  getRandomNumber(): number {
    return Math.floor(Math.random() * 230) + 90;
  }

  getTimeIntervalValue(): number {
    return 100;
  }

  getScrollViewParameters(): any {
    return { behavior: "smooth", block: "center", inline: "center" };
  }

  getObservableIntervalTimer(): number {
    return 5000;
  }

  getObservableIntervalTimerForNavbar(): number {
    return 1 * 30 * 1000;
  }

  checkTodayMatches(sportId, matchList): boolean {
    let _isAnyLiveMatch = false;
    let finishStatus;

    switch (sportId) {
      case SportIdEnum.Football:
        finishStatus = FootballMatchStatusEnum.FINISHED;
        break;
      case SportIdEnum.Tennis:
        finishStatus = TennisMatchStatusEnum.FULL_TIME;
        break;
      case SportIdEnum.Basketball:
        finishStatus = BasketBallMatchStatusEnum.FINISHED;
        break;
      case SportIdEnum.IceHockey:
        finishStatus = IceHockeyMatchStatusEnum.FINISHED;
        break;
    }

    let _todayDate = new Date().toLocaleDateString();
    let liveMatches = _.filter(matchList, function (match) {
      let _matchDate = new Date(match.MatchDate);
      let _matchDate_string = _matchDate.toLocaleDateString();
      return (_matchDate_string == _todayDate && match.MatchStatusId != finishStatus
      )
    })
    if (liveMatches.length > 0)
      _isAnyLiveMatch = true;

    return _isAnyLiveMatch;
  }
}
