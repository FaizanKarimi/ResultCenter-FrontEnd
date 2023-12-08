import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballRoutingModule } from './football-routing.module';
import { football } from './football.component';
import { FootballmatchinfoComponent } from './footballmatchinfo/footballmatchinfo.component';
import { ResultListComponent } from './resultList.component';
import { RoundResultListComponent } from './roundresultList.component';
import { LeagueTableComponent } from './leaguetable.component';
import { HeadToHeadComponent } from './headtohead.component';
import { HeadToHeadResultComponent } from './headtoheadresult.component';
import { StatsComponent } from './stats.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
// import { MatchInfoResultComponent } from './matchinfo.component';
import { SharedModule } from "../shared-module/shared-module.module";
import { PointtypePipe } from './pointtype.pipe';
import { OrderbyPipe } from "./pipes/orderby.pipe";


@NgModule({
  imports: [
    FootballRoutingModule,
    SharedModule
  ],
  declarations: [
    football,
    ResultListComponent,
    RoundResultListComponent,
    LeagueTableComponent,
    HeadToHeadComponent,
    HeadToHeadResultComponent,
    StatsComponent,
    FootballmatchinfoComponent,
    // MatchInfoResultComponent,
    PointtypePipe,
    OrderbyPipe
  ]
})
export class FootballModule { }

