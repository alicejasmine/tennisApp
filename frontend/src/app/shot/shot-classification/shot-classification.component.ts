import {Component, OnInit} from '@angular/core';

import {ModalController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {DataService} from 'src/app/data.service';
import {MatchWithPlayers} from 'src/app/models';
import {firstValueFrom} from 'rxjs';


@Component({
  selector: 'app-shot-classification',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Shot Classification</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card *ngIf="this.dataService.currentMatch">
        <ion-card-header>
          <ion-card-title>
            {{ this.dataService.currentMatch.date | date:'dd-MM-yyyy' }} {{ this.dataService.currentMatch.fullNamePlayer1 }}
            VS {{ this.dataService.currentMatch.fullNamePlayer2 }}
          </ion-card-title>
        </ion-card-header>
        <ion-button *ngIf="!matchStarted" (click)="startMatch()" color="warning">Start Match</ion-button>

        <ion-card-content *ngIf="matchStarted">

          <ion-item
            *ngIf="this.dataService.currentMatch.playerId1 && this.dataService.currentMatch.fullNamePlayer1">
            <ion-label>{{ this.dataService.currentMatch.fullNamePlayer1 }}</ion-label>
            <ion-button
              [color]="selectedShotClassification === 'Winner' && selectedPlayerId === this.dataService.currentMatch.playerId1 ? 'success' : 'light'"
              (click)="selectedPlayerId = this.dataService.currentMatch.playerId1; selectedShotClassification = 'Winner';"
            >
              Winner
            </ion-button>
            <ion-button
              [color]="selectedShotClassification === 'Forced Error' && selectedPlayerId === this.dataService.currentMatch.playerId1 ? 'success' : 'light'"
              (click)="selectedPlayerId = this.dataService.currentMatch.playerId1; selectedShotClassification = 'Forced Error';"
            >
              Forced Error
            </ion-button>
            <ion-button
              [color]="selectedShotClassification === 'Unforced Error' && selectedPlayerId === this.dataService.currentMatch.playerId1 ? 'success' : 'light'"
              (click)="selectedPlayerId = this.dataService.currentMatch.playerId1; selectedShotClassification = 'Unforced Error';"
            >
              Unforced Error
            </ion-button>
          </ion-item>
          <ion-item
            *ngIf="this.dataService.currentMatch.playerId2 && this.dataService.currentMatch.fullNamePlayer2">
            <ion-label>{{ this.dataService.currentMatch.fullNamePlayer2 }}</ion-label>
            <ion-button
              [color]="selectedShotClassification === 'Winner' && selectedPlayerId === this.dataService.currentMatch.playerId2 ? 'success' : 'light'"
              (click)="selectedPlayerId = this.dataService.currentMatch.playerId2; selectedShotClassification = 'Winner';"
            >
              Winner
            </ion-button>
            <ion-button
              [color]="selectedShotClassification === 'Forced Error' && selectedPlayerId === this.dataService.currentMatch.playerId2 ? 'success' : 'light'"
              (click)="selectedPlayerId = this.dataService.currentMatch.playerId2; selectedShotClassification = 'Forced Error';"
            >
              Forced Error
            </ion-button>
            <ion-button
              [color]="selectedShotClassification === 'Unforced Error' && selectedPlayerId === this.dataService.currentMatch.playerId2 ? 'success' : 'light'"
              (click)="selectedPlayerId = this.dataService.currentMatch.playerId2; selectedShotClassification = 'Unforced Error';"
            >
              Unforced Error
            </ion-button>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <ion-button *ngIf="matchStarted"
                  (click)="registerShotClassification(this.dataService.currentMatch.id, selectedPlayerId, selectedShotClassification)"
                  [disabled]="!selectedShotClassification">Next
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./shot-classification.component.scss'],
})
export class ShotClassificationComponent {

  selectedShotClassification: string | undefined;
  selectedPlayerId: number | undefined;
  matchStarted: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public dataService: DataService,
    public httpClient: HttpClient) {
    this.getMatch()
  }

  async getMatch() {
    try {
      const id = (await firstValueFrom(this.route.paramMap)).get('matchId');
      this.dataService.currentMatch = (await firstValueFrom(this.httpClient.get<MatchWithPlayers>('api/matches/' + id)));

    } catch (e) {
      this.router.navigate(['']);
    }
  }


  async startMatch() {
    this.matchStarted = true;
  }

  registerShotClassification(matchId: number | undefined, playerId: number | undefined, shotType: string | undefined) {

    this.dataService.currentShot.playerId = playerId;
    this.dataService.currentShot.matchId = matchId;
    this.dataService.currentShot.shotClassification = shotType;
    this.selectedShotClassification = undefined; //clear selected button
    this.router.navigate(['/shot-type/' + matchId + '/' + playerId]);

  }

}
