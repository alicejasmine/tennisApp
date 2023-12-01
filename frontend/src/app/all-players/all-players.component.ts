import {Component, OnInit} from '@angular/core';
import {Player} from '../models';
import {DataService} from "../data.service";
import {ModalController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {CreatePlayerComponent} from '../create-player/create-player.component';
import {UpdatePlayerComponent} from '../update-player/update-player.component';


@Component({
  selector: 'app-all-players',
  template: `

    <ion-toolbar>

      <ion-title>Players</ion-title>

    </ion-toolbar>

    <ion-content class="ion-padding" fullscreen="true">
      <div class="container">
        <ion-searchbar animated="true" placeholder="Search players" debounce="100"
                       (ionInput)="handleInput($event)"></ion-searchbar>
        <ion-button (click)="openCreatePLayer()">Create</ion-button>
      </div>
      <div class="container">
        <ion-card *ngFor="let player of dataService.players">
          <ion-card-header>
            <ion-card-subtitle>PLAYER</ion-card-subtitle>
            <ion-card-title>{{player.fullName}}</ion-card-title>
          </ion-card-header>

          <ion-button fill="clear" (click)="openUpdatePlayer(player.playerId)">Update</ion-button>

        </ion-card>
      </div>

    </ion-content>`,
  styleUrls: ['./all-players.component.scss'],
})
export class AllPlayersComponent {
  player: Player | undefined;

  constructor(public modalController: ModalController,
              public route: ActivatedRoute,
              public router: Router,
              public dataService: DataService,
              public http: HttpClient) {
    this.getAllPlayers();
  }


  async getAllPlayers() {

    const QueryParams = await firstValueFrom(this.route.queryParams);
    const query = QueryParams['searchTerm'] ?? '';
    const call = this.http.get<Player[]>(`api/players/search?SearchTerm=${query}`);
    this.dataService.players = await firstValueFrom<Player[]>(call);

  }


  async handleInput($event: any) {
    const query = $event.target.value;
    const call = this.http.get<Player[]>(`api/players/search?SearchTerm=${query}`);
    this.dataService.players = await firstValueFrom<Player[]>(call);
  }

  async openCreatePLayer() {
    const modal = await this.modalController.create({
      component: CreatePlayerComponent
    });
    modal.present();
  }


  async openUpdatePlayer(playerId: number | undefined) {
    if (playerId !== undefined) {
      const modal = await this.modalController.create({
        component: UpdatePlayerComponent,
        componentProps: {
          playerId: playerId
        }
      });
      modal.present();
    }
  }
}
