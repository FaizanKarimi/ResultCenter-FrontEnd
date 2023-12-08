import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { football } from "./football.component";
import { FootballmatchinfoComponent } from "./footballmatchinfo/footballmatchinfo.component";

const routes: Routes = [
  { path: '', component: football },
  { path: 'football-matchinfo/:id', component: FootballmatchinfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootballRoutingModule { }

