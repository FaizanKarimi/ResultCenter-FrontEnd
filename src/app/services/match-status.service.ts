import { Injectable } from '@angular/core';
import { BasketBallMatchStatusEnum } from "../BusinessModel/Basketball/basketball-match-status-enum";
import { SportIdEnum } from "../BusinessModel/Shared/sportId-enum";

@Injectable()
export class MatchStatusService {

  constructor() { }

  isMatchLive(MatchStatusId: number, SportId: SportIdEnum): boolean {
    let status = false;
    switch (SportId) {
      case SportIdEnum.Football:
        if (MatchStatusId >= 13 && MatchStatusId <= 17)
          status = true;
        break;
      case SportIdEnum.Tennis:
        if (MatchStatusId >= 26 && MatchStatusId <= 30)
          status = true;
        break;
      case SportIdEnum.Basketball:
        if (MatchStatusId == BasketBallMatchStatusEnum.FIRST_QUARTER
          || MatchStatusId == BasketBallMatchStatusEnum.SECOND_QUARTER
          || MatchStatusId == BasketBallMatchStatusEnum.THIRD_QUARTER
          || MatchStatusId == BasketBallMatchStatusEnum.FORTH_QUARTER
          || MatchStatusId == BasketBallMatchStatusEnum.OVER_TIME)
          status = true;
        break;
    }
    return status;
  }

}