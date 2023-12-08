import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IceHockeyRoutingModule } from './ice-hockey-routing.module';
import { IceHockeyHomeComponent } from './ice-hockey-home/ice-hockey-home.component';
import { SharedModule } from "../shared-module/shared-module.module";
import { ContentListComponent } from './content-list/content-list.component';
import { ResultListComponent } from './result-list/result-list.component';
import { LeagueResultsComponent } from './league-results/league-results.component';
import { StandingsComponent } from './standings/standings.component';
import { StatsComponent } from './stats/stats.component';
import { HeadToHeadComponent } from './head-to-head/head-to-head.component';
import { StatsCalculationService } from "./stats/stats-calculation.service";
import { H2HcalculationService } from "./head-to-head/h2-hcalculation.service";
import { MatchScoreFormatService } from "./services/match-score-format.service";
import { CountryNamePipe } from "./pipes/country-name.pipe";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IceHockeyRoutingModule
  ],
  declarations: [
    IceHockeyHomeComponent,
    ContentListComponent,
    ResultListComponent,
    LeagueResultsComponent,
    StandingsComponent,
    StatsComponent,
    HeadToHeadComponent,
    CountryNamePipe
  ],
  providers: [
    StatsCalculationService,
    MatchScoreFormatService,
    H2HcalculationService]
})
export class IceHockeyModule { }

