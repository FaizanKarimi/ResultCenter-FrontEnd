import { Component, OnInit } from '@angular/core';
import { HttpService } from "../../services/httpService";
import { ApiUrls } from '../../CommonUtility/apiUrls';
import { IceHockeyStandings } from '../../BusinessModel/IceHockey/IceHockeyStandings';
import { MemoryService } from '../../services/memory.service';
import * as _ from 'lodash';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { LanguageService } from '../../services/language.service';
import { IceHockeyEnum } from "../../BusinessModel/IceHockey/ice-hockey-enum";
@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {
  statusMessage: string;
  standings: IceHockeyStandings[];
  isLoading = true;
  languageKeys: any;
  constructor(private _httpService: HttpService, private _memoryService: MemoryService,private _languageService: LanguageService) {
    this.standings = new Array<IceHockeyStandings>();
  }

  ngOnInit() {
    let contestGroupId = this._memoryService.getIceHockeyDropDownValues(IceHockeyEnum.ContestGroupId);
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
    if(contestGroupId==0)
    {
      this.isLoading = false;
    }
    else
    if (contestGroupId) {
     
      this.getStandingsResultFromServer(contestGroupId);
    }
  }

  private getStandingsResultFromServer(contestGroupId: number) {
    let body = { ContestGroupId: contestGroupId };
    this._httpService.getDataFromServer(ApiUrls.IceHockeyStandings, '', body)
      .subscribe((response) => {
        this.isLoading = false;
        let data = (<any>response).data;
        if (data != null) {
          this.standings = this._formatData(data);
        }
      }, (error) => {
        this.isLoading = false;
        this.statusMessage = 'Problem in service please try again after some time';
      });
  }

  private _formatData(data: any): any {
    _.forEach(data, function (stand) {
      if (stand.LostOT == null) {
        stand.LostOT = "-";
      }
    });
    return data;
  }
}