import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ApiUrls } from '../../CommonUtility/apiUrls';
import { CommonService } from '../../services/common.service';
import * as _ from 'lodash';
import { MemoryService } from '../../services/memory.service';
import { HttpService } from "../../services/httpService";
import { ApiResponseMessage } from "../../CommonUtility/apiResponseMessage";
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { SportOrg } from "../../BusinessModel/Tennis/SportOrgModel";
import { TennisContestGroup } from "../../BusinessModel/Tennis/TennisContestGroupModel";
import { TennisResult } from "../../BusinessModel/Tennis/TennisResultModel";
import { TennisScoreInfoTypeEnum } from "../../BusinessModel/Tennis/tennis-score-info-type-enum.enum";
import { LiveSportsService } from '../../services/live-sports.service';
import { SportIdEnum } from '../../BusinessModel/Shared/sportId-enum';

@Component({
  selector: 'tennis-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class TennisResultListComponent implements OnChanges, OnInit, OnDestroy {
  resultss: TennisContestGroup;
  results: TennisResult;
  pageIndex: number = 0;
  pageSize: number = 10;
  isLoading: boolean = true;
  status: string;
  ErrorMessage: string;
  sportOrg: SportOrg;
  showMore: boolean;
  languageKeys: any;
  TennisScoreInfoTypeEnum: typeof TennisScoreInfoTypeEnum = TennisScoreInfoTypeEnum;
  liveSportsSubcription: Subscription;

  @Input() inputSelectedDate: string;
  @Input() inputSelectedLeague: any;
  @Output() outSelectedContest = new EventEmitter<object>();

  constructor(private _liveSportsService: LiveSportsService, private _httpService: HttpService, private _commonService: CommonService, private _memoryService: MemoryService, private _router: Router, private _languageService: LanguageService) {
    this.results = new TennisResult();
    this.results.ContestGroups = new Array();
    this.showMore = true;
    this.isLoading = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputSelectedDate'] && changes['inputSelectedDate'].currentValue != undefined) {
      this.isLoading = true;
      this.pageIndex = 0;
      this.results = new TennisResult();
      this.results.ContestGroups = new Array();
      this.BindMatchResult(this.inputSelectedDate, this.pageIndex, this.pageSize);
    }
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
  }

  ngOnInit(): void {
    this.liveSportsSubcription = this._liveSportsService.$data.subscribe((sports) => {
      var _tennisObj = sports.find(sport => {
        return sport.SportId === SportIdEnum.Tennis
      })
      let _todayDate = new Date().toLocaleDateString();
      if (_tennisObj.IsLive && this.inputSelectedDate == _todayDate) {
        this.BindMatchResult(this.inputSelectedDate, 0, this.pageSize * (this.pageIndex + 1), false, true);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.liveSportsSubcription)
      this.liveSportsSubcription.unsubscribe();
  }

  redirectToAction(matchId: any, contestGroupName: string, matchStatusId: number, IsMatchScoreAvailable: boolean) {
    //Checking if the contestGroup is not the challenger than donot navigate to tennis match info page.
    var challenger = contestGroupName.substring(0, 4);
    if (matchStatusId != 24 && challenger != 'Chs ' && IsMatchScoreAvailable) {
      this._memoryService.sendMessage(false);
      this._router.navigate(['tennis/tennis-matchinfo', matchId]);
    }
  }

  public onContestSelect(orgId, contestId, orgName, contestGroupName) {
    let obj = {
      SportOrgId: orgId,
      contestId: contestId,
      orgName: orgName,
      contestGroupName: contestGroupName
    };
    this.outSelectedContest.emit(obj);
  }

  public onScrollDown() {
    //increment page index.
    this.pageIndex++;
    let date = this._commonService.getDate(this.inputSelectedDate);
    this.BindMatchResult(date, this.pageIndex, this.pageSize, true);
  }

  private BindMatchResult(FromDate: any, PageIndex: number, PageSize: number, isLoadMore?: boolean, isLive?: boolean) {
    // this.isLoading = true;
    let body = { SportId: 2, FromDate: FromDate, ToDate: FromDate, PageIndex: PageIndex, PageSize: PageSize, IsLive: isLive ? isLive : false };
    this._httpService.getDataFromServer(ApiUrls.TennisResultList, 'test', body)
      .subscribe(
        (response) => {
          this.status = (<any>response).status;
          if (this.status == ApiResponseMessage.success) {
            if (response != null) {
              let data = (<any>response).data;
              this.results.SportId = data.SportId;
              this.results.SportName = data.SportName;
              let _contestGroupArray = new Array();
              if (data.ContestGroups != null && data.ContestGroups.length > 0) {
                _.forEach(data.ContestGroups, (_contestGroup) => {

                  //Removing the game score from results
                  _.forEach(_contestGroup.Matches, function (_matches) {
                    _matches.MatchScores = _.filter(_matches.MatchScores, function (_matchScores) {
                      return !(_matchScores.ScoreInfoTypeId == TennisScoreInfoTypeEnum.Finished || _matchScores.ScoreInfoTypeId == TennisScoreInfoTypeEnum.CFS);
                    });
                  });
                  _contestGroupArray.push(_contestGroup);
                });

                if (!isLoadMore)
                  this.results.ContestGroups = _contestGroupArray;
                else this.results.ContestGroups.push.apply(this.results.ContestGroups, _contestGroupArray);

                if (data.ContestGroups.length < PageSize) this.showMore = false;
                else this.showMore = true;
              }
              else if (PageIndex > 0) {
                this.isLoading = false;
                this.showMore = false;
              }
              else {
                this.isLoading = false;
                this.showMore = false;
                this.results.ContestGroups = null;
              }

            }
            else {
              //Do nothing.
            }
            this.status = '';
            this.isLoading = false;
            this.ErrorMessage = '';
          } else {
            this.ErrorMessage = (<any>response).message;
            this.isLoading = false;
            this.showMore = false;
          }

        });
  }
}