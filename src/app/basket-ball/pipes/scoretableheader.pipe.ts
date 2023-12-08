import { Pipe, PipeTransform } from '@angular/core';
import { BasketballScoreInfoTypeEnum } from "../../BusinessModel/Basketball/Basketball-score-info-type-enum";

@Pipe({
  name: 'scoretableheader'
})
export class ScoretableheaderPipe implements PipeTransform {

  transform(ScoreInfoType: any, args?: any): any {
    switch (ScoreInfoType) {
      case BasketballScoreInfoTypeEnum.firstQuarter:
        return "1";
      case BasketballScoreInfoTypeEnum.secondQuarter:
        return "2";
      case BasketballScoreInfoTypeEnum.thirdQuarter:
        return "3";
      case BasketballScoreInfoTypeEnum.forthQuarter:
        return "4";
      case BasketballScoreInfoTypeEnum.OverTime:
        return "OT";
      case BasketballScoreInfoTypeEnum.Finished: case BasketballScoreInfoTypeEnum.FinishedOverTime:
        return "Tot";
    }
    return null;
  }

}
