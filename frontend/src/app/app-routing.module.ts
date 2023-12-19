import {NgModule} from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./account/login.component";
import { RegisterComponent } from "./account/register.component";
import { MatchStatisticsComponent } from './match-statistics/match-statistics.component';
import { ShotClassificationComponent } from './shot/shot-classification/shot-classification.component';
import { ShotTypeComponent } from './shot/shot-type/shot-type.component';
import { ShotDestinationAndDirectionComponent } from './shot/shot-destination-and-direction/shot-destination-and-direction.component';
import { PlayerPositionComponent } from './shot/player-position/player-position.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'tabs/home',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'match-info/:id',
        component: MatchStatisticsComponent
      },
      {
        path: 'shot-classification/:matchId',
        component: ShotClassificationComponent
      },
      { path: 'shot-type/:matchId/:playerId',
        component: ShotTypeComponent

      },
      { path: 'shot-destination-and-direction/:matchId/:playerId',
        component:  ShotDestinationAndDirectionComponent
        },
      { path: 'player-position/:matchId/:playerId',
        component: PlayerPositionComponent

      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
