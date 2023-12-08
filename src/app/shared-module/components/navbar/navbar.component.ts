import { Component, OnInit } from '@angular/core';
import { NabarService } from "./nabar-service.service";
import { Observable } from "rxjs/Rx";
import { NavbarModel } from "../../../BusinessModel/Navbar/NavbarModel";
import { HttpService } from "../../../services/httpService";
import { ApiUrls } from "../../../CommonUtility/apiUrls";
import { CommonService } from "../../../services/common.service";
import { LiveSportsService } from "../../../services/live-sports.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  timerSubscription: any;
  NavbarItems: NavbarModel[];
  isLoading: boolean;

  constructor(private _httpService: HttpService, private _navbarService: NabarService,
    private _commonService: CommonService, private liveSportsService: LiveSportsService) {
    this.NavbarItems = new Array<NavbarModel>();
  }

  ngOnInit() {
    this.getLiveSportsFromServer();
  }

  ngOnDestroy() {
    if (this.timerSubscription)
      this.timerSubscription.unsubscribe();
  }

  getLiveSportsFromServer() {
    this.isLoading = true;
    let body = {};
    this._httpService.getDataFromServer(ApiUrls.NavbarLiveSports, "test", body)
      .subscribe((resultData) => {
        if ((<any>resultData).data && (<any>resultData).data.length > 0) {
          let _liveSportsDBModel = (<any>resultData).data;
          this.NavbarItems = this._navbarService.getNavbarItems(_liveSportsDBModel);
          this.timerSubscription = Observable
            .interval(this._commonService.getObservableIntervalTimerForNavbar())
            .timeInterval()
            .flatMap(() =>
              this._httpService.getDataFromServer(ApiUrls.NavbarLiveSports, 'test', body)
            )
            .subscribe((resultData) => {
              if ((<any>resultData).data && (<any>resultData).data.length > 0) {
                let _liveSportsDBModel = (<any>resultData).data;
                this.NavbarItems = this._navbarService.getNavbarItems(_liveSportsDBModel);
                this.liveSportsService.SetLiveSportsData(_liveSportsDBModel);
              }
            });
        }
      }, (error) => {
      });
  }
}

