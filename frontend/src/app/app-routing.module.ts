import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./account/login.component";
import {RegisterComponent} from "./account/register.component";
import {UsersComponent} from "./user/users.component";
import {AuthenticatedGuard} from "./guards";
import { TabsComponent } from './tabs.component';
import { AccountComponent } from './account/account.component';
import { AllPlayersComponent } from './all-players/all-players.component';
import { MatchesComponent } from './home/matches.component';
import {MatchStatisticsComponent} from "./match-statistics/match-statistics.component";



const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [

      {
        path: 'home',
        component: MatchesComponent,
      },
      {
        path: '',
        redirectTo: 'home',
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
        path:'all-players',
        component:AllPlayersComponent
      }
    ]
  },
  {
    path: 'match-info/:matchId',
    component: MatchStatisticsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
