import { Injectable } from '@angular/core';
import { NavbarDBModel } from "../BusinessModel/Navbar/NavbarDBModel";
import { Subject } from "rxjs/Subject";

@Injectable()
export class LiveSportsService {

  public $data = new Subject<NavbarDBModel[]>();
  private lastCallStatus = new Array<NavbarDBModel>();

  constructor() {
  }
  
  SetLiveSportsData(liveSports) {
    if (this.lastCallStatus.length == 0) {
      this.lastCallStatus = liveSports;
      this.$data.next(liveSports);
    }
    else {
      this.$data.next(this.lastCallStatus)
      this.lastCallStatus = liveSports;
    }
  }
}
