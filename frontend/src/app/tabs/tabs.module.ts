import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

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

// Child routes under 'tabs'
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        component: MatchesComponent,
      },
      {
        path: 'all-players',
        component: AllPlayersComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthenticatedGuard],
        data: { roles: [Role.Admin] }
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
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
