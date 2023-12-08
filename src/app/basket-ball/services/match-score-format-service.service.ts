import { Injectable } from '@angular/core';
import { BasketballMatch } from "../../BusinessModel/Basketball/BasketballMatch";
import * as _ from 'lodash';
import { BasketballMatchScores } from "../../BusinessModel/Basketball/BasketballMatchScores";
import { BasketballScoreInfoTypeEnum } from "../../BusinessModel/Basketball/Basketball-score-info-type-enum";

@Injectable()
export class MatchScoreFormatService {

  constructor() { }

  getFormattedMatchSocres(match: any, nullValue: any) {

    // _.map(matchList, (match) => {
    let firstQuarter = _.filter(match.BasketballMatchScores, function (ms) { return ms.ScoreInfoTypeId == BasketballScoreInfoTypeEnum.firstQuarter }).length;
    let secondQuarter = _.filter(match.BasketballMatchScores, function (ms) { return ms.ScoreInfoTypeId == BasketballScoreInfoTypeEnum.secondQuarter }).length;
    let thirdQuarter = _.filter(match.BasketballMatchScores, function (ms) { return ms.ScoreInfoTypeId == BasketballScoreInfoTypeEnum.thirdQuarter }).length;
    let forthQuarter = _.filter(match.BasketballMatchScores, function (ms) { return ms.ScoreInfoTypeId == BasketballScoreInfoTypeEnum.forthQuarter }).length;
    if (firstQuarter == 0) {
      let _matchScoreObj = new BasketballMatchScores();
      _matchScoreObj = {
        AwayScore: nullValue,
        HomeScore: nullValue,
        ScoreInfoTypeId: BasketballScoreInfoTypeEnum.firstQuarter
      };

      //Inserting score at 0 index to keep order same
      match.BasketballMatchScores.splice(0, 0, _matchScoreObj);
    }

    if (secondQuarter == 0) {
      let _matchScoreObj = new BasketballMatchScores();
      _matchScoreObj = {
        AwayScore: nullValue,
        HomeScore: nullValue,
        ScoreInfoTypeId: BasketballScoreInfoTypeEnum.secondQuarter
      };

      //Inserting score at 1 index to keep order same
      match.BasketballMatchScores.splice(1, 0, _matchScoreObj);
    }

    if (thirdQuarter == 0) {
      let _matchScoreObj = new BasketballMatchScores();
      _matchScoreObj = {
        AwayScore: nullValue,
        HomeScore: nullValue,
        ScoreInfoTypeId: BasketballScoreInfoTypeEnum.thirdQuarter
      };

      //Inserting score at 2 index to keep order same
      match.BasketballMatchScores.splice(2, 0, _matchScoreObj);
    }

    if (forthQuarter == 0) {
      let _matchScoreObj = new BasketballMatchScores();
      _matchScoreObj = {
        AwayScore: nullValue,
        HomeScore: nullValue,
        ScoreInfoTypeId: BasketballScoreInfoTypeEnum.forthQuarter
      };

      //Inserting score at 3 index to keep order same
      match.BasketballMatchScores.splice(3, 0, _matchScoreObj);
    }
    // });

    match.BasketballMatchScores = _.take(match.BasketballMatchScores, 6);
    return match;
  }

}
