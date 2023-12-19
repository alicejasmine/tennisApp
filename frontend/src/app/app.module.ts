import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ErrorHttpInterceptor } from 'src/interceptors/error-http-interceptor';
import { TokenService } from 'src/services/token.service';
import { LoginComponent } from './account/login.component';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './account/register.component';
import { AccountService } from '../services/account.service';
import { UsersComponent } from './user/users.component';
import {ReactiveFormsModule} from "@angular/forms";
import { AuthHttpInterceptor } from 'src/interceptors/auth-http-interceptor';
import {AuthenticatedGuard} from "./guards";
import { RewriteHttpInterceptor } from 'src/interceptors/rewrite-http-interceptor';
import {CreateMatchComponent} from "./create-match/create-match.component";
import {EditMatchComponent} from "./edit-match/edit-match.component";
import { AllPlayersComponent } from './all-players/all-players.component';
import { DataService } from './data.service';
import { FormsModule } from '@angular/forms';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { MatchesComponent } from './home/matches.component';
import {UserService} from "../services/user.service";
import {CreateUserComponent} from "./user/create-user-component";
import {EditUserComponent} from "./user/edit-user.component";
import {AuthService} from "../services/AuthService";
import {UserDirective} from "../directives/user.directive";
import { TabsModule } from './tabs/tabs.module';
import {DirectiveModule} from "../directives/directive.module";



import { DeleteMatchComponent } from './delete-match/delete-match.component';
import { MatchStatisticsComponent } from './match-statistics/match-statistics.component';
import { PlayerPositionComponent } from './shot/player-position/player-position.component';
import { ShotDestinationAndDirectionComponent } from './shot/shot-destination-and-direction/shot-destination-and-direction.component';
import { ShotClassificationComponent } from './shot/shot-classification/shot-classification.component';
import { ShotTypeComponent } from './shot/shot-type/shot-type.component';
import { EditEndingMatchComponent } from './edit-match/edit-ending-match.component';


@NgModule({
  declarations: [
    // functional declarations
    AppComponent,
    UserDirective,

    // page comps
    MatchesComponent,
    UsersComponent,
    AccountComponent,
    RegisterComponent,
    LoginComponent,
    AllPlayersComponent,

    // creation comps
    CreatePlayerComponent,
    CreateMatchComponent,
    CreateUserComponent,

    // edit comps
    EditMatchComponent,
    EditPlayerComponent,
    EditUserComponent,
    EditEndingMatchComponent,

    // shot comps
    ShotClassificationComponent,
    ShotTypeComponent,
    ShotDestinationAndDirectionComponent,
    PlayerPositionComponent,
    MatchStatisticsComponent,

    // delete comps
    DeleteMatchComponent,
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, HttpClientModule, FormsModule, TabsModule, DirectiveModule],
  exports: [UserDirective],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // INTERCEPTORS
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHttpInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RewriteHttpInterceptor, multi: true },
    // AUTH SERVICES & GUARDS
    TokenService,
    AuthenticatedGuard,
    AuthService,
    // OTHER SERVICES
    AccountService,
    DataService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
