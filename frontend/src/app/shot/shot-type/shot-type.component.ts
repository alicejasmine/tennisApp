import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {DataService} from 'src/app/data.service';

@Component({
  selector: 'app-shot-type',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Shot Type</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item *ngFor="let shot of shotTypes">

          <ion-button
            [class.selected]="selectedShotType === shot"
            [color]="selectedShotType === shot ? 'success' : 'light'"
            (click)="selectShotType(shot)"

          >
            {{ shot }}
          </ion-button>
        </ion-item>
      </ion-list>

      <ion-button [disabled]="!selectedShotType" (click)="registerShotType(selectedShotType)">Next</ion-button>
    </ion-content>
  `,
  styleUrls: ['./shot-type.component.scss'],
})
export class ShotTypeComponent {
  shotTypes: string[] = [
    'Forehand Groundstroke',
    'Forehand Return',
    'Serve Deuce',
    'Serve Add',
    'Backhand Groundstroke',
    'Backhand Return',
    'Forehand Volley',
    'Backhand Volley',
    'Overhead',
    'Other'
  ];
  selectedShotType: string | undefined;

  constructor(public route: ActivatedRoute,
              public router: Router,
              public dataService: DataService,
              public httpClient: HttpClient) {
  }


  selectShotType(shot: string) {
    this.selectedShotType = shot; //this.dataService.currentShot.shotType = shot; ? and remove selectedshottype, register shot type only navigation
  }

  registerShotType(shotType: string | undefined) {
    this.dataService.currentShot.shotType = shotType;
    this.selectedShotType = undefined;
    this.router.navigate(['/shot-destination-and-direction/' + this.dataService.currentMatch.id + '/' + this.dataService.currentPlayer.playerId]);

  }
}
