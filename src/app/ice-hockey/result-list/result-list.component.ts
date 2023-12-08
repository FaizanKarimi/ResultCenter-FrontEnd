import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpService } from "../../services/httpService";
import { ApiUrls } from "../../CommonUtility/apiUrls";
import * as _ from 'lodash';
import { IceHockeyResult } from "../../BusinessModel/IceHockey/IceHockeyResult";
import { LanguageService } from '../../services/language.service';
import { MatchScoreFormatService } from "../services/match-score-format.service";
import { SportIdEnum } from "../../BusinessModel/Shared/sportId-enum";
import { Subscription } from 'rxjs';
import { LiveSportsService } from '../../services/live-sports.service';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['../ice-hockey-home/ice-hockey-home.component.css']
})

export class ResultListComponent implements OnChanges, OnInit, OnDestroy {
  isLoading: boolean;
  pageIndex: number;
  results: any;
  pageSize: number;
  matchesList: IceHockeyResult;
  isMatchNull: boolean;
  showMore: boolean;
  languageKeys: any;
  SportId: number
  liveSportsSubcription: Subscription;

  @Input() inputSelectedDate: string;
  @Output() outSelectedContest = new EventEmitter<object>();


  constructor(private _liveSportsService: LiveSportsService, private _httpService: HttpService, private _matchScoreFormatService: MatchScoreFormatService, private _languageService: LanguageService) {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.matchesList = new IceHockeyResult();
    this.matchesList.IceHockeyContestGroups = new Array<any>();
    this.isMatchNull = false;
    this.showMore = true;
    this.SportId = SportIdEnum.IceHockey;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    if (changes['inputSelectedDate'] && changes['inputSelectedDate'].currentValue != undefined) {
      this.isLoading = true;
      this.pageIndex = 0;
      this.matchesList = new IceHockeyResult();
      this.matchesList.IceHockeyContestGroups = new Array<any>();
      //   this.results.ContestGroups = new Array();
      this.BindMatchResult(SportIdEnum.IceHockey, this.inputSelectedDate, this.pageIndex, this.pageSize);
    }
  }

  ngOnInit(): void {
    this.liveSportsSubcription = this._liveSportsService.$data.subscribe((sports) => {
      var _icehockeyObj = sports.find(sport => {
        return sport.SportId === SportIdEnum.IceHockey
      })
      let _todayDate = new Date().toLocaleDateString();
      if (_icehockeyObj.IsLive && this.inputSelectedDate == _todayDate) {
        this.BindMatchResult(SportIdEnum.IceHockey, this.inputSelectedDate, 0, this.pageSize * (this.pageIndex + 1), false, true);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.liveSportsSubcription)
      this.liveSportsSubcription.unsubscribe();
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
    this.BindMatchResult(SportIdEnum.IceHockey, this.inputSelectedDate, this.pageIndex, this.pageSize, true);
  }

  BindMatchResult(sportid: number, date: string, pageIndex: number, pageSize: number, isLoadMore?: boolean, isLive?: boolean) {
    // this.isLoading = true;
    let body = { SportId: sportid, FromDate: date, PageIndex: pageIndex, PageSize: pageSize, IsLive: isLive ? isLive : false }
    this._httpService.getDataFromServer(ApiUrls.IceHockeyMatchList, 'test', body).subscribe(
      response => {
        if ((<any>response).data != undefined && (<any>response).data.IceHockeyContestGroups != null) {
          let _data = (<any>response).data;
          let _contestGroupArray = new Array();
          if (_data.IceHockeyContestGroups != null) {
            _.forEach(_data.IceHockeyContestGroups, (_contestGroup) => {
              _contestGroup.IceHockeyMatches = this._matchScoreFormatService.getFormattedMatchSocres(_contestGroup.IceHockeyMatches);
              // this.matchesList.IceHockeyContestGroups.push(_contestGroup);
              _contestGroupArray.push(_contestGroup);
            });

            if (!isLoadMore)
              this.matchesList.IceHockeyContestGroups = _contestGroupArray;
            else this.matchesList.IceHockeyContestGroups.push.apply(this.matchesList.IceHockeyContestGroups, _contestGroupArray);

            if (_data.IceHockeyContestGroups.length < pageSize) this.showMore = false;
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

