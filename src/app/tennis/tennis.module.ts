import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TennisRoutingModule } from './tennis-routing.module';
import { ContentListComponent } from './content-list/content-list.component';
import { LeagueResultListComponent } from './league-result-list/league-result-list.component';
import { TennisMatchInfoComponent } from './tennis-match-info/tennis-match-info.component';
import { TennisDrawComponent } from './tennis-draw/tennis-draw.component';
import { TennisStatComponent } from './tennis-stat/tennis-stat.component';
import { TennisHeadToHeadComponent } from './tennis-head-to-head/tennis-head-to-head.component';
import { TennisHeadToHeadTeamsComponent } from './tennis-head-to-head-teams/tennis-head-to-head-teams.component';
import { TennisHeadToHeadResultsComponent } from './tennis-head-to-head-results/tennis-head-to-head-results.component';
import { TennisResultListComponent } from "./result-list/result-list.component";
import { TennisComponent } from "./tennis.component";
import { SharedModule } from "../shared-module/shared-module.module";
import { FormsModule } from "@angular/forms";
import { StatHeadersPipe } from './pipes/stat-headers.pipe';
import { FilterTeamsPipe } from "./pipes/filter-teams.pipe";
import { IsPointScorePipe } from "./pipes/is-point-score.pipe";
import { PlayerNamePipe } from "./pipes/player-name.pipe";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TennisRoutingModule,
    FormsModule
  ],
  declarations: [
    TennisResultListComponent,
    ContentListComponent,
    LeagueResultListComponent,
    TennisMatchInfoComponent,
    TennisDrawComponent,
    TennisStatComponent,
    TennisHeadToHeadComponent,
    TennisHeadToHeadTeamsComponent,
    TennisHeadToHeadResultsComponent,
    TennisComponent,
    IsPointScorePipe,
    StatHeadersPipe,
    FilterTeamsPipe,
    PlayerNamePipe
  ]
})
export class TennisModule { }
