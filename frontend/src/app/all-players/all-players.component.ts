import {Component, OnInit} from '@angular/core';
import {Player, Role} from '../models';
import {DataService} from "../data.service";
import {ModalController} from '@ionic/angular';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {CreatePlayerComponent} from '../create-player/create-player.component';
import {EditPlayerComponent} from '../edit-player/edit-player.component';
import {AuthService} from "../../services/AuthService";

@Component({
  selector: 'app-all-players',
  template: `

    <ion-content style="--padding-top: 105px;" fullscreen="true">
      <div class="container">
        <ion-searchbar animated="true" placeholder="Search players" debounce="100"
                       (ionInput)="handleInput($event)"></ion-searchbar>
        <ion-button *appUserRole="[Role.Admin]" (click)="openCreatePlayer()">Create Player</ion-button>
      </div>
<ion-grid>
              <ion-row>
                  <ion-col size="12" size-sm="12" size-md="6" size-lg="4" *ngFor="let player of dataService.players">
                      <ion-card>
                          <ion-card-header>
                              <ion-card-title
                                      (click)="openPlayerMatches(player.fullName)">{{player.fullName}}</ion-card-title>
                              <ion-card-subtitle> {{ player.active ? 'Active' : 'Not Active' }}</ion-card-subtitle>
                          </ion-card-header>

          <ion-button *appUserRole="[Role.Admin]" fill="clear" (click)="openEditPlayer(player.playerId)">Update</ion-button>
                      </ion-card>
                  </ion-col>
              </ion-row>
          </ion-grid>

      </ion-content>`,

  styleUrls: ['./all-players.component.scss'],
})
export class AllPlayersComponent {
  player: Player | undefined;
  protected readonly Role = Role;
  constructor(public modalController: ModalController,
              public router: Router,
              public dataService: DataService,
              public http: HttpClient) {
    this.getAllPlayers();
  }


  async getAllPlayers() {

    const call = this.http.get<Player[]>('/api/players');
    this.dataService.players = await firstValueFrom<Player[]>(call);
  }


  async handleInput($event: any) {
    const query = $event.target.value;
    const call = this.http.get<Player[]>(`/api/players/search?SearchTerm=${query}`);
    this.dataService.players = await firstValueFrom<Player[]>(call);
  }

  async openCreatePlayer() {
    const modal = await this.modalController.create({
      component: CreatePlayerComponent,
      cssClass: 'modal-css'
    });
    modal.present();
  }


  async openEditPlayer(playerId: number | undefined) {
    if (playerId !== undefined) {
      const editingPlayer = this.dataService.players.find(player => player.playerId === playerId);
      if (editingPlayer) {
        this.dataService.currentPlayer = editingPlayer;
        const modal = await this.modalController.create({
          component: EditPlayerComponent,
          cssClass: 'modal-css'
        });
        modal.present();
      }
    }
  }

  async openPlayerMatches(fullname: string | undefined) {
    if (fullname !== undefined) {
      const navigationExtras: NavigationExtras = {
        queryParams: { fullName: fullname, fillSearchBar: true },
      };
      this.router.navigate(['tabs/home'], navigationExtras);
    }


  }


}
