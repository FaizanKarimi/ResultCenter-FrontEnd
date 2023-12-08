import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { RoundProgressModule } from "angular-svg-round-progressbar/dist";
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MemoryService } from "../services/memory.service";
import { HttpService } from "../services/httpService";
import { CommonService } from "../services/common.service";
import { LanguageService } from '../services/language.service';
import { MatchStatusService } from "../services/match-status.service";
import { LoaderComponent } from "./components/loader/loader.component";
import { ErrorMessageComponent } from "./components/error-message/error-message.component";
import { LiveClassPipe } from "./pipes/live-class.pipe";
import { ToggleDropDownDirective } from "./directives/toggle-drop-down.directive";
import { MatchStatusPipe } from "./pipes/match-status.pipe";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { NabarService } from "./components/navbar/nabar-service.service";
import { DecimalPipe } from "./pipes/decimal.pipe";
import { RoundNamePipe } from "./pipes/round-name.pipe";
import { TeamPositionPipe } from "./pipes/team-position.pipe";
import { LiveSportsService } from "../services/live-sports.service";

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    RoundProgressModule,
    RouterModule
  ],
  declarations: [
    DecimalPipe,
    NavbarComponent,
    LoaderComponent,
    TeamPositionPipe,
    ErrorMessageComponent,
    RoundNamePipe,
    ToggleDropDownDirective,
    LiveClassPipe,
    MatchStatusPipe,
  ],
  exports: [
    CommonModule,
    DecimalPipe,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    RoundProgressModule,
    NavbarComponent,
    LoaderComponent,
    TeamPositionPipe,
    ErrorMessageComponent,
    RoundNamePipe,
    ToggleDropDownDirective,
    LiveClassPipe,
    MatchStatusPipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        MemoryService,
        HttpService,
        CommonService,
        LanguageService,
        MatchStatusService,
        NabarService,
        LiveSportsService
      ]
    }
  }
}
