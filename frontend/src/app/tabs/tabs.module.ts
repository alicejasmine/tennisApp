import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

// Pages
import { MatchesComponent } from '../home/matches.component';
import { AllPlayersComponent } from '../all-players/all-players.component';
import { UsersComponent } from '../user/users.component';

// Component
import { TabsComponent } from './tabs.component';

// Guard
import { AuthenticatedGuard } from '../guards';
import {Role} from "../models";
import {DirectiveModule} from "../../directives/directive.module";
import {MatchStatisticsComponent} from "../match-statistics/match-statistics.component";
import {ShotClassificationComponent} from "../shot/shot-classification/shot-classification.component";
import {ShotTypeComponent} from "../shot/shot-type/shot-type.component";
import {
  ShotDestinationAndDirectionComponent
} from "../shot/shot-destination-and-direction/shot-destination-and-direction.component";
import {PlayerPositionComponent} from "../shot/player-position/player-position.component";

// Child routes under 'tabs'
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [

      // openly available components
      {
        path: 'home',
        component: MatchesComponent,
      },
      {
        path: 'all-players',
        component: AllPlayersComponent,
      },
      {
        path: 'match-info/:id',
        component: MatchStatisticsComponent
      },

      // From here we are controlling access.
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthenticatedGuard],
        data: { roles: [Role.Admin] }
      },
      {
        path: 'shot-classification/:matchId',
        component: ShotClassificationComponent,
        canActivate: [AuthenticatedGuard],
        data: { roles: [Role.Admin] }
      },
      { path: 'shot-type/:matchId/:playerId',
        component: ShotTypeComponent,
        canActivate: [AuthenticatedGuard],
        data: { roles: [Role.Admin] }

      },
      { path: 'shot-destination-and-direction/:matchId/:playerId',
        component:  ShotDestinationAndDirectionComponent,
        canActivate: [AuthenticatedGuard],
        data: { roles: [Role.Admin] }
      },
      { path: 'player-position/:matchId/:playerId',
        component: PlayerPositionComponent,
        canActivate: [AuthenticatedGuard],
        data: { roles: [Role.Admin] }
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectiveModule
  ],
  exports: [
    TabsComponent
  ],
  declarations: [TabsComponent]
})
export class TabsModule {}
