import {Component, OnInit} from '@angular/core';

import {ModalController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {DataService} from 'src/app/data.service';
import {MatchWithPlayers} from 'src/app/models';


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
              [color]="selectedShotType === 'winner' && selectedPlayerId === match.playerId1 ? 'success' : 'light'"
              (click)="recordShot(match.playerId1, 'winner')"
            >
              Winner
            </ion-button>
            <ion-button
              [color]="selectedShotType === 'forcedError' && selectedPlayerId === match.playerId1 ? 'success' : 'light'"
              (click)="recordShot(match.playerId1, 'forcedError')"
            >
              Forced Error
            </ion-button>
            <ion-button
              [color]="selectedShotType === 'unforcedError' && selectedPlayerId === match.playerId1 ? 'success' : 'light'"
              (click)="recordShot(match.playerId1, 'unforcedError')"
            >
              Unforced Error
            </ion-button>
          </ion-item>


          <ion-item *ngIf="match.playerId2 && match.fullNamePlayer2">
            <ion-label>{{ match.fullNamePlayer2 }}</ion-label>
            <ion-button
              [color]="selectedShotType === 'winner' && selectedPlayerId === match.playerId2 ? 'success' : 'light'"
              (click)="recordShot(match.playerId2, 'winner')"
            >
              Winner
            </ion-button>
            <ion-button
              [color]="selectedShotType === 'forcedError' && selectedPlayerId === match.playerId2 ? 'success' : 'light'"
              (click)="recordShot(match.playerId2, 'forcedError')"
            >
              Forced Error
            </ion-button>
            <ion-button
              [color]="selectedShotType === 'unforcedError' && selectedPlayerId === match.playerId2 ? 'success' : 'light'"
              (click)="recordShot(match.playerId2, 'unforcedError')"
            >
              Unforced Error
            </ion-button>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <ion-button *ngIf="matchStarted" (click)="goToNextComponent()" [disabled]="!selectedShotType">Next</ion-button>
    </ion-content>
  `,
  styleUrls: ['./shot-classification.component.scss'],
})
export class ShotClassificationComponent implements OnInit {
  match: MatchWithPlayers | undefined
  selectedShotType: string | undefined;
  selectedPlayerId: number | undefined;
  matchStarted: boolean = false;

  constructor(public modalController: ModalController,
              public route: ActivatedRoute,
              public router: Router,
              public dataService: DataService,
              public http: HttpClient) {
  }

  ngOnInit() {

  }

  async goToNextComponent() {

  }

  async startMatch() {
    this.matchStarted = true;
  }

  recordShot(playerId: number, shotType: string) {

    this.selectedPlayerId = playerId;
    this.selectedShotType = shotType;
  }
}
