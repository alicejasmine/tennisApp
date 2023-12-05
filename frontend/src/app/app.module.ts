import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PlayerMatchesComponent} from "./player-matches/player-matches.component";
import { AllPlayersComponent } from './all-players/all-players.component';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { DataService } from './data.service';

@NgModule({
  declarations: [AppComponent,AllPlayersComponent , CreatePlayerComponent, EditPlayerComponent, PlayerMatchesComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, DataService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
