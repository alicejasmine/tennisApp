import {Component, OnInit} from '@angular/core';

import {ModalController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {DataService} from 'src/app/data.service';
import {MatchWithPlayers} from 'src/app/models';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-shot-classification',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Shot Classification</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card *ngIf="match">
        <ion-card-header>
          <ion-card-title>
            {{ match.date | date:'dd-MM-yyyy' }} {{ match.fullNamePlayer1 }} VS {{ match.fullNamePlayer2 }}
          </ion-card-title>
        </ion-card-header>
        <ion-button *ngIf="!matchStarted" (click)="startMatch()" color="warning">Start Match</ion-button>

        <ion-card-content *ngIf="matchStarted">

          <ion-item *ngIf="match.playerId1 && match.fullNamePlayer1">
            <ion-label>{{ match.fullNamePlayer1 }}</ion-label>
            <ion-button
              [color]="selectedShotClassification === 'winner' && selectedPlayerId === match.playerId1 ? 'success' : 'light'"
              (click)="selectedPlayerId = match.playerId1; selectedShotClassification = 'winner';"
            >
              Winner
            </ion-button>
            <ion-button
              [color]="selectedShotClassification === 'forcedError' && selectedPlayerId === match.playerId1 ? 'success' : 'light'"
              (click)="selectedPlayerId = match.playerId1; selectedShotClassification = 'forcedError';"
            >
              Forced Error
            </ion-button>
            <ion-button
              [color]="selectedShotClassification === 'unforcedError' && selectedPlayerId === match.playerId1 ? 'success' : 'light'"
              (click)="selectedPlayerId = match.playerId1; selectedShotClassification = 'unforcedError';"
            >
              Unforced Error
            </ion-button>
          </ion-item>


          <ion-item *ngIf="match.playerId2 && match.fullNamePlayer2">
            <ion-label>{{ match.fullNamePlayer2 }}</ion-label>
            <ion-button
              [color]="selectedShotClassification === 'winner' && selectedPlayerId === match.playerId2 ? 'success' : 'light'"
              (click)="selectedPlayerId = match.playerId2; selectedShotClassification = 'winner';"
            >
              Winner
            </ion-button>
            <ion-button
              [color]="selectedShotClassification === 'forcedError' && selectedPlayerId === match.playerId2 ? 'success' : 'light'"
              (click)="selectedPlayerId = match.playerId2; selectedShotClassification = 'forcedError';"
            >
              Forced Error
            </ion-button>
            <ion-button
              [color]="selectedShotClassification === 'unforcedError' && selectedPlayerId === match.playerId2 ? 'success' : 'light'"
              (click)="selectedPlayerId = match.playerId2; selectedShotClassification = 'unforcedError';"
            >
              Unforced Error
            </ion-button>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <ion-button *ngIf="matchStarted && match" (click)="registerShot(match.id, selectedPlayerId, selectedShotClassification)" [disabled]="!selectedShotClassification">Next</ion-button>
    </ion-content>
  `,
  styleUrls: ['./shot-classification.component.scss'],
})
export class ShotClassificationComponent {
  match: MatchWithPlayers | undefined
  selectedShotClassification: string | undefined;
  selectedPlayerId: number | undefined;
  matchStarted: boolean = false;

  constructor(public modalController: ModalController,
              public route: ActivatedRoute,
              public router: Router,
              public dataService: DataService,
              public httpClient: HttpClient,) {
this.getMatch()
  }

  async getMatch() {
    try {
      const id = (await firstValueFrom(this.route.paramMap)).get('matchId');
      this.match=this.dataService.currentMatch = (await firstValueFrom(this.httpClient.get<MatchWithPlayers>('api/matches/' + id)));

    } catch (e) {
      this.router.navigate(['']);
    }
  }


  async startMatch() {
    this.matchStarted = true;
  }

  registerShot(matchId:number |undefined ,playerId: number |undefined  , shotType: string|undefined) {

    this.selectedPlayerId = playerId;
    this.selectedShotClassification = shotType;

    this.router.navigate(['/shot-type/'+matchId +'/'+ playerId]);
  }

}
