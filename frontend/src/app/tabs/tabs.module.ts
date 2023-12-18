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

// Child routes under 'tabs'
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        outlet: 'tab',
        component: MatchesComponent,
      },
      {
        path: 'all-players',
        outlet: 'tab',
        component: AllPlayersComponent,
      },
      {
        path: 'users',
        outlet: 'tab',
        component: UsersComponent,
        canActivate: [AuthenticatedGuard],
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
  ],
  exports: [
    TabsComponent
  ],
  declarations: [TabsComponent]
})
export class TabsModule {}
