import { Pipe, PipeTransform } from '@angular/core';
import { BasketballScoreInfoTypeEnum } from "../../BusinessModel/Basketball/Basketball-score-info-type-enum";

@Pipe({
    name: 'isFinishScore'
})
export class BasketballFinishScorePipe implements PipeTransform {
    transform(StatusId: Number): boolean {
        let res: boolean
        res = false;
        switch (StatusId) {
            case BasketballScoreInfoTypeEnum.Finished:
            case BasketballScoreInfoTypeEnum.FinishedOverTime:
                res = true;
                break;
            default:
                res = false;
                break;
        }
        return res;
    }
}