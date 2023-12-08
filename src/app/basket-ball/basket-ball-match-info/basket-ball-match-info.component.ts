import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from '../../services/httpService';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ApiUrls } from '../../CommonUtility/apiUrls';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { identifierModuleUrl } from '@angular/compiler';
import { Chart } from 'chart.js';
import { MatchStatusService } from "../../services/match-status.service";
import { MatchScoreFormatService } from "../services/match-score-format-service.service";
import { LanguageService } from '../../services/language.service';
import { MemoryService } from '../../services/memory.service';
import { BasketballScoreInfoTypeEnum } from "../../BusinessModel/Basketball/Basketball-score-info-type-enum";
import { SportIdEnum } from "../../BusinessModel/Shared/sportId-enum";
@Component({
  selector: 'app-basket-ball-match-info',
  templateUrl: './basket-ball-match-info.component.html',
  styleUrls: ['./basket-ball-match-info.component.css']
})
export class BasketBallMatchInfoComponent implements OnInit {
  awayTeamLable: string;
  homeTeamLable: string;

  @ViewChild('canvas') canvas: ElementRef;
  private timerSubscription: any;
  totalhome: number;
  totalaway: number;
  matchInfo: any;
  chart: any;
  matchid: number;
  isLoading: boolean;
  scoreinfotype: any;
  languageKeys: any;
  scoreStatus: string;
  tableHeader: any;

  constructor(private _httpService: HttpService, private _avRoute: ActivatedRoute, private _commonService: CommonService,
    private _matchStatusService: MatchStatusService, private _matchScoreFormatService: MatchScoreFormatService, private _languageService: LanguageService
    , private _memoryService: MemoryService, private _router: Router) {
    this.totalhome = null;
    this.totalaway = null;
  }

  ngOnInit() {
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    this.scoreinfotype = new Array<any>();
    if (this._avRoute.snapshot.params["id"]) {
      this.matchid = this._avRoute.snapshot.params["id"];
      this.getMatchInfoResultFromServer(this.matchid);
    }
  }

  ngOnDestroy() {
    if (this.timerSubscription)
      this.timerSubscription.unsubscribe();
  }
  backToBasketball() {
    this._memoryService.sendMessage(true);
    this._router.navigate(['basket-ball']);
  }
  getMatchInfoResultFromServer(matchid: number) {
    this.isLoading = true;
    let body = { matchid: matchid };
    this._httpService.getDataFromServer(ApiUrls.BasketballMatchinfo, 'test', body)
      .subscribe(
        (data) => {
          let _data = (<any>data).data;
          if (_data != null) {
            this.matchInfo = this._calculateMatchInfo(_data);
            this._bindCharts(this.matchInfo, true);
          }

          //checking if the match is live or not.
          let status = this._matchStatusService.isMatchLive(_data.MatchStatusId, SportIdEnum.Basketball);
          if (status) {
            //   this.totalcounts = new Array<any>();
            let params = { MatchId: matchid, IsLive: true }
            this.timerSubscription = Observable
              .interval(this._commonService.getObservableIntervalTimer())
              .timeInterval()
              .flatMap(() =>
                this._httpService.getDataFromServer(ApiUrls.BasketballMatchinfo, 'test', params)
              ).subscribe(data => {
                let _data = (<any>data).data;
                if (_data != null) {
                  this.matchInfo = this._calculateMatchInfo(_data);
                  this._bindCharts(this.matchInfo, false);
                }
              });
          }
          else {
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe();
            }
          }
          this.isLoading = false;
        });

  }

  _bindCharts(matchInfo: any, isFirstInterval: boolean) {
    let homeTeamScores = new Array();
    let awayTeamScores = new Array();

    //Inserting 0 at the start of Array to start graph from zero point
    homeTeamScores.push(0);
    awayTeamScores.push(0);
    //Neglecting FT scores and other scores
    let _scores = _.filter(matchInfo.BasketballMatchScores, function (ms) {
      return (ms.ScoreInfoTypeId >= BasketballScoreInfoTypeEnum.OverTime && (ms.HomeScore != null || ms.AwayScore != null));
    });

    //calculating the sum of scores and inserting them into arrays for graph lines
    _.map(_scores, function (m, i: number) {
      let _homeScore = +homeTeamScores[i] + +m.HomeScore;
      let _awayScore = +awayTeamScores[i] + +m.AwayScore;
      homeTeamScores.push(_homeScore);
      awayTeamScores.push(_awayScore);
    });

    this.totalhome = homeTeamScores[homeTeamScores.length - 1];
    this.totalaway = awayTeamScores[awayTeamScores.length - 1];

    //Pushing values for graph line label
    this.scoreinfotype = new Array();
    let graphLabelArray = new Array();
    graphLabelArray.push(' ');
    _.forEach(_scores, (s) => {
      let label = this._getGraphLabel(s.ScoreInfoTypeId);
      graphLabelArray.push(label);
    })

    this.homeTeamLable = this._getFormatedTeamName(matchInfo.HomeTeamName);
    this.awayTeamLable = this._getFormatedTeamName(matchInfo.AwayTeamName);
    if (isFirstInterval) {
      Chart.defaults.global.defaultFontColor = '#fff';
      this.chart = new Chart(this.canvas.nativeElement.getContext('2d'), {
        type: 'line',
        data: {
          labels: graphLabelArray,
          datasets: [
            {
              label: this._getFormatedTeamName(matchInfo.HomeTeamName),
              data: homeTeamScores,
              borderColor: "#3cba9f",
              borderWidth: 2,
              fill: false,
              backgroundColor: "#3cba9f",
              lineTension: 0,
            },
            {
              label: this._getFormatedTeamName(matchInfo.AwayTeamName),
              data: awayTeamScores,
              borderColor: "#ffcc00",
              borderWidth: 2,
              fill: false,
              backgroundColor: "#ffcc00",
              lineTension: 0,
            },
          ]
        },
        options: {
          maintainAspectRatio: false,
          resposive: true,
          legend: {
            display: false,

          },
          scales: {
            xAxes: [{
              position: 'top',
              display: true,
              gridLines: {
                color: "#2e2e2e",
              },
            }],
            yAxes: [{
              ticks: {
                min: 0,
              },
              gridLines: {
                color: "#2e2e2e",
                zeroLineColor: "#2e2e2e",
              },
            }],
          }
        }
      });
    }
    else {
      this.chart.data.labels = graphLabelArray;
      this.chart.data.datasets[0].label = this._getFormatedTeamName(matchInfo.HomeTeamName)
      this.chart.data.datasets[1].label = this._getFormatedTeamName(matchInfo.AwayTeamName)
      this.chart.data.datasets[0].data = homeTeamScores;
      this.chart.data.datasets[1].data = awayTeamScores;
      this.chart.update();
    }
  }

  private _calculateMatchInfo(match: any) {
    let finalScore = _.filter(match.BasketballMatchScores, function (ms) {
      return ms.ScoreInfoTypeId == BasketballScoreInfoTypeEnum.Finished ||
        ms.ScoreInfoTypeId == BasketballScoreInfoTypeEnum.FinishedOverTime
    })
    if (finalScore.length > 0) {
      if (finalScore[0].ScoreInfoTypeId == BasketballScoreInfoTypeEnum.Finished) {
        this.scoreStatus = "FT";
      }
      else
        this.scoreStatus = "OT";
    }
    else {
      this.scoreStatus = "Live"
    }
    let _matchinfo = this._matchScoreFormatService.getFormattedMatchSocres(match, null);
    _matchinfo.BasketballMatchScores = _.filter(_matchinfo.BasketballMatchScores, function (ms) {
      return ms.ScoreInfoTypeId != BasketballScoreInfoTypeEnum.CS
        && ms.ScoreInfoTypeId != BasketballScoreInfoTypeEnum.CFS
    })
    return _matchinfo;
  }

  private _getFormatedTeamName(TeamName: string) {
    return TeamName.replace(/[\(\\w\)]/g, '');
  }

  _getGraphLabel(scoreInfoTypeId: any) {
    switch (scoreInfoTypeId) {
      case BasketballScoreInfoTypeEnum.firstQuarter:
        return "1Q";
      case BasketballScoreInfoTypeEnum.secondQuarter:
        return "2Q";
      case BasketballScoreInfoTypeEnum.thirdQuarter:
        return "3Q";
      case BasketballScoreInfoTypeEnum.forthQuarter:
        return "4Q";
      case BasketballScoreInfoTypeEnum.OverTime:
        return "OT";
      case BasketballScoreInfoTypeEnum.Finished: case BasketballScoreInfoTypeEnum.FinishedOverTime:
        return "FT";
    }
  }
}