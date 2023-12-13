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
import { AccountService } from './account/account.service';
import { UsersComponent } from './user/users.component';
import {ReactiveFormsModule} from "@angular/forms";
import { AuthHttpInterceptor } from 'src/interceptors/auth-http-interceptor';
import {AuthenticatedGuard} from "./guards";
import { HeaderComponent } from './header.component';
import { RewriteHttpInterceptor } from 'src/interceptors/rewrite-http-interceptor';
import { TabsComponent } from './tabs.component';
import {CreateMatchComponent} from "./create-match/create-match.component";
import {EditMatchComponent} from "./edit-match/edit-match.component";
import { AllPlayersComponent } from './all-players/all-players.component';
import { DataService } from './data.service';
import { FormsModule } from '@angular/forms';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { MatchesComponent } from './home/matches.component';
import {UserService} from "./user/user.service";
import {CreateUserComponent} from "./user/create-user-component";


@NgModule({
  declarations: [AppComponent,
    MatchesComponent,
    UsersComponent,
    TabsComponent,
    AccountComponent,
    RegisterComponent,
    LoginComponent,
  HeaderComponent,
    CreateMatchComponent,
    EditMatchComponent,
    AllPlayersComponent,
    CreatePlayerComponent,
    EditPlayerComponent,
    CreateUserComponent
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, HttpClientModule,FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHttpInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RewriteHttpInterceptor, multi: true },
    TokenService,
    AuthenticatedGuard,
    AccountService,
    DataService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
