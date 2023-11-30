import {Component, OnInit} from '@angular/core';
import {Player} from '../models';
import {DataService} from "../data.service";
import {ModalController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-all-players',
  template: `

    <ion-content class="ion-padding" fullscreen="true">
      <ion-searchbar placeholder="Search player.."></ion-searchbar>
      <ion-card *ngFor="let player of dataService.players">
        <ion-card-header>
          <ion-card-subtitle>PLAYER</ion-card-subtitle>
          <ion-card-title>{{player.fullName}}</ion-card-title>
        </ion-card-header>

        <ion-button fill="clear">Update</ion-button>

      </ion-card>
    </ion-content>`,
  styleUrls: ['./all-players.component.scss'],
})
export class AllPlayersComponent {
player:Player | undefined;

  constructor(public modalController: ModalController,
              public route: ActivatedRoute,
              public router: Router,
              public dataService: DataService,
              public http: HttpClient) {
    this.getAllPlayers();
  }
  resultsPerPage: number = 6;
  currentPage: number = 1;

  async getAllPlayers() {

    const QueryParams = await firstValueFrom(this.route.queryParams);
    const page = QueryParams['page'] ?? 1
    const resultsPerPage = QueryParams['resultsPerPage'] ?? 2;
    this.currentPage = Number.parseInt(page) ?? 1;
    this.resultsPerPage = Number.parseInt(resultsPerPage) ?? 2;
    this.dataService.players = await firstValueFrom<Player[]>(this.http.get<Player[]>(
      environment.baseUrl + "/players?page=" + this.currentPage + "&resultsPerPage=" + this.resultsPerPage));

  }

}
