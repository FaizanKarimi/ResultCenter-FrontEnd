import { Pipe, PipeTransform } from '@angular/core';
import { TennisMatchStatusEnum } from "../../BusinessModel/Tennis/TennisMatchStatusEnum.enum";
import { IceHockeyMatchStatusEnum } from "../../BusinessModel/IceHockey/IceHockeyMatchStatusEnum.enum";
import { FootballMatchStatusEnum } from "../../BusinessModel/Football/FootballMatchStatusEnum.enum";
import { BasketBallMatchStatusEnum } from "../../BusinessModel/Basketball/basketball-match-status-enum";

@Pipe({
  name: 'MatchStatusPipe'
})
export class MatchStatusPipe implements PipeTransform {

  transform(StatusId: Number, matchDate: string, currentMinute?: any): string {
    let month = new Array();
    month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let st = '';
    switch (StatusId) {
      case FootballMatchStatusEnum.NSY:
        st = matchDate;
        break;
      case FootballMatchStatusEnum.RESULT_ONLY:
        st = matchDate;
        break;
      case FootballMatchStatusEnum.FINISHED:
        st = 'FT';
        break;
      case FootballMatchStatusEnum.FINISHED_AP:
        st = 'Fi. AP';
        break;
      case FootballMatchStatusEnum.FINISHED_AET:
        st = 'AET';
        break;
      case FootballMatchStatusEnum.TO_FINISH:
        st = 'ToFi';
        break;
      case FootballMatchStatusEnum.CANCELLED:
        st = 'Canc.';
        break;
      case FootballMatchStatusEnum.POSTPONED:
        st = 'Post.';
        break;
      case FootballMatchStatusEnum.ABANDONED:
        st = 'Aban.';
        break;
      case FootballMatchStatusEnum.INTERRUPTED:
        st = 'Inter.';
        break;
      case FootballMatchStatusEnum.AWARDED:
        st = 'AAw';
        break;
      case FootballMatchStatusEnum.HALF_TIME:
        st = "HT'";
        break;
      case FootballMatchStatusEnum.FIRST_HALF:
      case FootballMatchStatusEnum.SECOND_HALF:
      case FootballMatchStatusEnum.ET_FIRST_HALF:
      case FootballMatchStatusEnum.ET_SECOND_HALF:
        st = currentMinute + "'";
        break;
      case TennisMatchStatusEnum.NSY:
        // let d = new Date(matchDate);
        // st = d.getDate() + ' ' + month[d.getMonth()];
        st = this.getMatchTime(matchDate);
        break;
      case TennisMatchStatusEnum.FULL_TIME:
        st = 'FT';
        break;
      case TennisMatchStatusEnum.FIRST_SET:
        st = 'S1';
        break;
      case TennisMatchStatusEnum.SECOND_SET:
        st = 'S2';
        break;
      case TennisMatchStatusEnum.THIRD_SET:
        st = 'S3';
        break;
      case TennisMatchStatusEnum.FORTH_SET:
        st = 'S4';
        break;
      case TennisMatchStatusEnum.FIFTH_SET:
        st = 'S5';
        break;
      case TennisMatchStatusEnum.POSTPONED:
        st = 'Post.';
        break;
      case TennisMatchStatusEnum.RETIRED_PLAYER_1:
        st = 'Rtr.P1';
        break;
      case TennisMatchStatusEnum.RETIRED_PLAYER_2:
        st = 'Rtr.P2';
        break;
      case TennisMatchStatusEnum.RESULT_ONLY:
        st = 'R/O';
        break;
      case TennisMatchStatusEnum.TO_FINISH:
        st = 'ToFin.';
        break;
      case TennisMatchStatusEnum.CANCELLED:
        st = 'Canc.';
        break;
      case TennisMatchStatusEnum.SUSPENDED:
        st = 'Sus.';
        break;
      case TennisMatchStatusEnum.RAIN_DELAY:
        st = 'R.D';
        break;
      case TennisMatchStatusEnum.INTERRUPTED:
        st = 'Int.';
        break;
      case TennisMatchStatusEnum.AWARDED_PLAYER_1:
        st = 'Awd.P1';
        break;
      case TennisMatchStatusEnum.AWARDED_PLAYER_2:
        st = 'Awd.P2';
        break;
      case IceHockeyMatchStatusEnum.NSY:
        let d = new Date(matchDate);
        st = d.getDate() + ' ' + month[d.getMonth()];
        break;
      case IceHockeyMatchStatusEnum.FINISHED:
        st = 'FT';
        break;
      case IceHockeyMatchStatusEnum.FIRST_PERIOD:
        st = '1P';
        break;
      case IceHockeyMatchStatusEnum.SECOND_PERIOD:
        st = '2P';
        break;
      case IceHockeyMatchStatusEnum.THIRD_PERIOD:
        st = '3P';
        break;
      case IceHockeyMatchStatusEnum.OVER_TIME:
        st = 'OT';
        break;
      case IceHockeyMatchStatusEnum.POSTPONED:
        st = 'Post';
        break;
      case IceHockeyMatchStatusEnum.RESULT_ONLY:
        st = 'R/O';
        break;
      case IceHockeyMatchStatusEnum.CANCELLED:
        st = 'Canc';
        break;
      case IceHockeyMatchStatusEnum.INTERRUPTED:
        st = 'Int.';
        break;
      case IceHockeyMatchStatusEnum.FINISHED_OT:
        st = 'FT';
        break;
      case IceHockeyMatchStatusEnum.FINISHED_AP:
        st = 'FT';
        break;
      case BasketBallMatchStatusEnum.NSY:
        d = new Date(matchDate);
        st = d.getDate() + ' ' + month[d.getMonth()];
        break;
      case BasketBallMatchStatusEnum.FIRST_QUARTER:
        st = '1Q';
        break;
      case BasketBallMatchStatusEnum.SECOND_QUARTER:
        st = '2Q';
        break;
      case BasketBallMatchStatusEnum.THIRD_QUARTER:
        st = '3Q';
        break;
      case BasketBallMatchStatusEnum.FORTH_QUARTER:
        st = '4Q';
        break;
      case BasketBallMatchStatusEnum.BREAK:
        st = 'Br.';
        break;
      case BasketBallMatchStatusEnum.FINISHED:
      case BasketBallMatchStatusEnum.FINISHED_OT:
        st = 'FT';
        break;
      case BasketBallMatchStatusEnum.OVER_TIME:
        st = 'OT';
        break;
      case BasketBallMatchStatusEnum.POSTPONED:
        st = 'Post.';
        break;
      case BasketBallMatchStatusEnum.RESULT_ONLY:
        st = 'R/O';
        break;
      case BasketBallMatchStatusEnum.CANCELLED:
        st = 'Canc.';
        break;
      case BasketBallMatchStatusEnum.INTERRUPTED:
        st = 'Int.';
        break;
      case BasketBallMatchStatusEnum.DELAYED:
        st = 'Del.';
        break;
      case BasketBallMatchStatusEnum.ABANDONED:
        st = 'Abn.';
        break;
    }
    return st;
  }

  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  getMatchTime(matchDate: string) {
    let time = '';
    let d = new Date(matchDate);
    let hours = d.getHours();
    let minutes = d.getMinutes() == 0 ? d.getMinutes() + '0' : d.getMinutes();
    time = hours + ':' + minutes;
    return time;
  }

}
