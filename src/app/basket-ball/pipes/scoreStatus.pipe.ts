import { Pipe, PipeTransform } from '@angular/core';
import { BasketBallMatchStatusEnum } from "../../BusinessModel/Basketball/basketball-match-status-enum";

@Pipe({
    name: 'scoreStatus'
})
export class BasketballScoreStatusPipe implements PipeTransform {
    transform(StatusId: Number): string {
        let res: string
        res = '';
        switch (StatusId) {
            case BasketBallMatchStatusEnum.FINISHED_OT:
                res = 'OT';
                break;
            default:
                res = '';
                break;
        }
        return res;
    }
}