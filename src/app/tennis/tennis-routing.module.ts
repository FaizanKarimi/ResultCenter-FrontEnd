import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TennisComponent } from "./tennis.component";
import { TennisMatchInfoComponent } from "./tennis-match-info/tennis-match-info.component";

const routes: Routes = [
  { path: '', component: TennisComponent },
  { path: 'tennis-matchinfo/:id', component: TennisMatchInfoComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TennisRoutingModule { }