import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./account/login.component";
import { RegisterComponent } from "./account/register.component";
import { AuthenticatedGuard } from "./guards";
import { AccountComponent } from './account/account.component';
import { AllPlayersComponent } from './all-players/all-players.component';
import { MatchesComponent } from './home/matches.component';

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
        path:'account',
        component: AccountComponent,
        canActivate: [AuthenticatedGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
