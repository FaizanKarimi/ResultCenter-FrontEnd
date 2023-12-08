import { Pipe, PipeTransform } from '@angular/core';
import { BasketBallMatchStatusEnum } from "../../BusinessModel/Basketball/basketball-match-status-enum";


@Pipe({
    name: 'isLiveMatch'
})
export class BasketballLiveMatch implements PipeTransform {
    transform(StatusId: Number): boolean {
        let res: boolean
        res = false;
        switch (StatusId) {
            case BasketBallMatchStatusEnum.FIRST_QUARTER:
            case BasketBallMatchStatusEnum.SECOND_QUARTER:
            case BasketBallMatchStatusEnum.THIRD_QUARTER:
            case BasketBallMatchStatusEnum.FORTH_QUARTER:
            case BasketBallMatchStatusEnum.OVER_TIME:
                res = true;
                break;
            default:
                res = false;
                break;
        }
        return res;
    }
}
