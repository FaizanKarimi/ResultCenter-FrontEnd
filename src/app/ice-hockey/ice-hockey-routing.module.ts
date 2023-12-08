import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IceHockeyHomeComponent } from './ice-hockey-home/ice-hockey-home.component';
const routes: Routes = [
  { path: '', component: IceHockeyHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IceHockeyRoutingModule { }

