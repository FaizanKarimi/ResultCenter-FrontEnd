import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { BasketballResult } from "../../BusinessModel/Basketball/BasketballResult";
import { HttpService } from "../../services/httpService";
import { BasketballContestGroup } from "../../BusinessModel/Basketball/BasketballContestGroup";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import * as _ from 'lodash';
import { MatchScoreFormatService } from "../services/match-score-format-service.service";
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { MemoryService } from '../../services/memory.service';
import { SportIdEnum } from "../../BusinessModel/Shared/sportId-enum";
import { Subscription } from 'rxjs';
import { LiveSportsService } from '../../services/live-sports.service';

@Component({
  selector: 'result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})

export class ResultListComponent implements OnChanges, OnInit {
  isLoading: boolean;
  pageIndex: number;
  results: any;
  pageSize: number;
  matchesList: BasketballResult;
  isMatchNull: boolean;
  showMore: boolean;
  languageKeys: any;
  liveSportsSubcription: Subscription;

  @Input() inputSelectedDate: string;
  @Output() outSelectedContest = new EventEmitter<object>();

  constructor(private _liveSportsService: LiveSportsService, private _httpService: HttpService, private _matchScoreFormatService: MatchScoreFormatService, private _router: Router, private _languageService: LanguageService, private _memoryService: MemoryService) {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.matchesList = new BasketballResult();
    this.matchesList.BasketballContestGroups = new Array<BasketballContestGroup>();
    this.isMatchNull = false;
    this.showMore = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    if (changes['inputSelectedDate'] && changes['inputSelectedDate'].currentValue != undefined) {
      this.isLoading = true;
      this.pageIndex = 0;
      this.matchesList = new BasketballResult();
      this.matchesList.BasketballContestGroups = new Array<BasketballContestGroup>();
      //   this.results.ContestGroups = new Array();
      this.BindMatchResult(SportIdEnum.Basketball, this.inputSelectedDate, this.pageIndex, this.pageSize);
    }
  }

  ngOnInit(): void {
    this.liveSportsSubcription = this._liveSportsService.$data.subscribe((sports) => {
      var _basetballObj = sports.find(sport => {
        return sport.SportId === SportIdEnum.Basketball
      })
      let _todayDate = new Date().toLocaleDateString();
      if (_basetballObj.IsLive && this.inputSelectedDate == _todayDate) {
        this.BindMatchResult(SportIdEnum.Basketball, this.inputSelectedDate, 0, this.pageSize * (this.pageIndex + 1), false, true);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.liveSportsSubcription)
      this.liveSportsSubcription.unsubscribe();
  }

  redirectToAction(matchId: any, matchStatusId: number, ) {
    //Checking if the contestGroup is not the challenger than donot navigate to tennis match info page.
    if (matchStatusId != 93 && matchStatusId != 134) {
      this._memoryService.sendMessage(false);
      this._router.navigate(['basket-ball/basketball-matchinfo', matchId]);
    }
  }

  onContestSelect(countryId: number, countryName: string, contestId: number, contestName: string) {
    let obj = {
      countryId: countryId,
      countryName: countryName,
      contestId: contestId,
      contestName: contestName
    };
    this.outSelectedContest.emit(obj);
  }

  onScrollDown() {
    this.pageIndex++;
    this.BindMatchResult(SportIdEnum.Basketball, this.inputSelectedDate, this.pageIndex, this.pageSize, true);
  }

  BindMatchResult(sportid: number, date: string, pageIndex: number, pageSize: number, isLoadMore?: boolean, isLive?: boolean) {
    // this.isLoading = true;
    let body = { SportId: sportid, FromDate: date, PageIndex: pageIndex, PageSize: pageSize, IsLive: isLive ? isLive : false }
    this._httpService.getDataFromServer(ApiUrls.BasketballMatchList, 'test', body).subscribe(
      response => {
        if ((<any>response).data != undefined && (<any>response).data.BasketballContestGroups != null) {
          let _data = (<any>response).data;
          if (_data.BasketballContestGroups != null) {
            let _contestGroupArray = new Array<BasketballContestGroup>();;
            _.forEach(_data.BasketballContestGroups, (_contestGroup) => {
              _.forEach(_contestGroup.BasketballMatches, (_match) => {
                _match = this._matchScoreFormatService.getFormattedMatchSocres(_match, "-");
              });
              //  _contestGroup.BasketballMatches = this._matchScoreFormatService.getFormattedMatchSocres(_contestGroup.BasketballMatches, "-");
              // this.matchesList.BasketballContestGroups.push(_contestGroup);
              _contestGroupArray.push(_contestGroup);
            });

            if (!isLoadMore)
              this.matchesList.BasketballContestGroups = _contestGroupArray;
            else this.matchesList.BasketballContestGroups.push.apply(this.matchesList.BasketballContestGroups, _contestGroupArray);


            if (_data.BasketballContestGroups.length < pageSize) this.showMore = false;
            else this.showMore = true;
          }
          this.isLoading = false;
          this.isMatchNull = false;
        }
        else {
          this.isMatchNull = true;
          this.showMore = false;
          this.isLoading = false;
        }
      });
  }

}
