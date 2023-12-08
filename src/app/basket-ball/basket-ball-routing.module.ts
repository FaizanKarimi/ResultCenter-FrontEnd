import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasktetBallHomeComponent } from "./basktet-ball-home/basktet-ball-home.component";
import {BasketBallMatchInfoComponent} from "./basket-ball-match-info/basket-ball-match-info.component";
const routes: Routes = [
  { path: '', component: BasktetBallHomeComponent },
  { path: 'basketball-matchinfo/:id', component: BasketBallMatchInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasketBallRoutingModule { }
