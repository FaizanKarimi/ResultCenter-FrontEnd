import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'football', loadChildren: 'app/football/football.module#FootballModule' },
    { path: 'tennis', loadChildren: 'app/tennis/tennis.module#TennisModule' },
    { path: 'ice-hockey', loadChildren: 'app/ice-hockey/ice-hockey.module#IceHockeyModule' },
    { path: 'basket-ball', loadChildren: 'app/basket-ball/basket-ball.module#BasketBallModule' },
    { path: '**', redirectTo: 'football', pathMatch: 'full' },
    { path: '', redirectTo: 'football', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
