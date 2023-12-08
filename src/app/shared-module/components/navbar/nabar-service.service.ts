import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { NavbarModel } from "../../../BusinessModel/Navbar/NavbarModel";
import { NavbarDBModel } from "../../../BusinessModel/Navbar/NavbarDBModel";
import { NavbarRouterLinkEnum } from "../../../BusinessModel/Navbar/NavbarRouterLink.enum";
import { SportIconClassEnum } from "../../../BusinessModel/Navbar/SportIconClass.enum";
import { SportIdEnum } from "../../../BusinessModel/Shared/sportId-enum";

@Injectable()
export class NabarService {

  NavbarItems: NavbarModel[];
  constructor() {
    this.NavbarItems = new Array<NavbarModel>();
    this._populateNavbarItems();
  }


  getNavbarItems(navbarDBModel: NavbarDBModel[]) {
    this.NavbarItems.forEach((item, index) => {
      item.IsLive = navbarDBModel[index].IsLive
    });
    return this.NavbarItems;
  }

  private _populateNavbarItems() {

    //Push football
    let FootballObj = new NavbarModel();
    FootballObj.SportId = SportIdEnum.Football;
    FootballObj.RouterLink = NavbarRouterLinkEnum.FootballLink.toString();
    FootballObj.IconClass = SportIconClassEnum.Football.toString();
    FootballObj.CollectionItem = 'football';
    FootballObj.ButtonText = 'Football';
    this.NavbarItems.push(FootballObj);

    //push Tennis
    let TennisObj = new NavbarModel();
    TennisObj.SportId = SportIdEnum.IceHockey;
    TennisObj.RouterLink = NavbarRouterLinkEnum.TennisLink.toString();
    TennisObj.IconClass = SportIconClassEnum.Tennis.toString();
    TennisObj.CollectionItem = 'tennis';
    TennisObj.ButtonText = 'Tennis';
    this.NavbarItems.push(TennisObj);

    //push IceHockey
    let IceHockeyObj = new NavbarModel();
    IceHockeyObj.SportId = SportIdEnum.IceHockey;
    IceHockeyObj.RouterLink = NavbarRouterLinkEnum.IceHockeyLink.toString();
    IceHockeyObj.IconClass = SportIconClassEnum.IceHockey.toString();
    IceHockeyObj.CollectionItem = 'icehockey';
    IceHockeyObj.ButtonText = 'Ice Hockey';
    this.NavbarItems.push(IceHockeyObj);

    //push Basketball
    let BasketballObj = new NavbarModel();
    BasketballObj.SportId = SportIdEnum.Basketball;
    BasketballObj.RouterLink = NavbarRouterLinkEnum.BasketballLink.toString();
    BasketballObj.IconClass = SportIconClassEnum.Basketball.toString();
    BasketballObj.CollectionItem = 'basketball';
    BasketballObj.ButtonText = 'Basketball';
    this.NavbarItems.push(BasketballObj);

  }
}
