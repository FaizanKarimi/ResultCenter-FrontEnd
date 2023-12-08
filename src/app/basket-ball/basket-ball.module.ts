import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasketBallRoutingModule } from './basket-ball-routing.module';
import { BasktetBallHomeComponent } from './basktet-ball-home/basktet-ball-home.component';
import { SharedModule } from "../shared-module/shared-module.module";
import { ContentListComponent } from './content-list/content-list.component';
import { ResultListComponent } from './result-list/result-list.component';
import { MatchScoreFormatService } from "./services/match-score-format-service.service";
import { BasketballLiveMatch } from "./pipes/live-match.pipe";
import { BasketballFinishScorePipe } from "./pipes/finish-score.pipe";
import { BasketballScoreStatusPipe } from "./pipes/scoreStatus.pipe";
import { LeagueResultListComponent } from './league-result-list/league-result-list.component';
import { BasketBallMatchInfoComponent } from './basket-ball-match-info/basket-ball-match-info.component';
import { StandingsComponent } from './standings/standings.component';
import { StatsComponent } from './stats/stats.component';
import { StatCalculationService } from "./stats/stat-calculation.service";
import { HeadToHeadComponent } from './head-to-head/head-to-head.component';
import { H2hCalculationService } from "./head-to-head/h2h-calculation.service";
import { TeamNamePipe } from './pipes/team-name.pipe';
import { ScoretableheaderPipe } from './pipes/scoretableheader.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BasketBallRoutingModule
  ],
  declarations: [
    BasketballLiveMatch,
    BasketballFinishScorePipe,
    BasketballScoreStatusPipe,
    BasktetBallHomeComponent,
    ContentListComponent,
    ResultListComponent,
    LeagueResultListComponent,
    BasketBallMatchInfoComponent,
    StandingsComponent,
    StatsComponent,
    HeadToHeadComponent,
    TeamNamePipe,
    ScoretableheaderPipe],

  providers: [
    MatchScoreFormatService,
    StatCalculationService,
    H2hCalculationService
  ]
})
export class BasketBallModule { }
