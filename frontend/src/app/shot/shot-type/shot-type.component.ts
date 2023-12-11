import {Component, OnInit} from '@angular/core';

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

      <ion-button [disabled]="!selectedShotType" (click)="saveShotType()">Next</ion-button>
    </ion-content>
  `,
  styleUrls: ['./shot-type.component.scss'],
})
export class ShotTypeComponent implements OnInit {
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

  constructor() {
  }

  ngOnInit() {
  }

  selectShotType(shot: string) {
    this.selectedShotType = shot;
  }

  saveShotType() {

  }
}
