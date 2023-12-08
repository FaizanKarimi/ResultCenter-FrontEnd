import { Pipe, PipeTransform } from '@angular/core';
import { IceHockeyMatchStatusEnum } from "../../BusinessModel/IceHockey/IceHockeyMatchStatusEnum.enum";
import { FootballMatchStatusEnum } from "../../BusinessModel/Football/FootballMatchStatusEnum.enum";
import { BasketBallMatchStatusEnum } from "../../BusinessModel/Basketball/basketball-match-status-enum";
import { TennisMatchStatusEnum } from "../../BusinessModel/Tennis/TennisMatchStatusEnum.enum";

@Pipe({
  name: 'liveClassPipe'
})
export class LiveClassPipe implements PipeTransform {

  transform(matchStatusId: number, args?: any): any {
    switch (matchStatusId) {
      case IceHockeyMatchStatusEnum.FIRST_PERIOD:
      case IceHockeyMatchStatusEnum.SECOND_PERIOD:
      case IceHockeyMatchStatusEnum.THIRD_PERIOD:
      case IceHockeyMatchStatusEnum.OVER_TIME:

      case BasketBallMatchStatusEnum.FIRST_QUARTER:
      case BasketBallMatchStatusEnum.SECOND_QUARTER:
      case BasketBallMatchStatusEnum.THIRD_QUARTER:
      case BasketBallMatchStatusEnum.FORTH_QUARTER:
      case BasketBallMatchStatusEnum.OVER_TIME:

      case TennisMatchStatusEnum.FIRST_SET:
      case TennisMatchStatusEnum.SECOND_SET:
      case TennisMatchStatusEnum.THIRD_SET:
      case TennisMatchStatusEnum.FORTH_SET:
      case TennisMatchStatusEnum.FIFTH_SET:

      case FootballMatchStatusEnum.FIRST_HALF:
      case FootballMatchStatusEnum.HALF_TIME:
      case FootballMatchStatusEnum.SECOND_HALF:
      case FootballMatchStatusEnum.ET_FIRST_HALF:
      case FootballMatchStatusEnum.ET_SECOND_HALF:
        return 'live';
      default:
        return '';
    }
  }

}
