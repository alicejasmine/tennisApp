import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shot-destination-and-direction',
  template:`
      <ion-header>
          <ion-toolbar>
              <ion-title>Shot Destination and Direction</ion-title>
          </ion-toolbar>
      </ion-header>
      <ion-content>
          <ion-card>
              <ion-card-content>
                  <ion-grid>
                      <ion-row>

                          <ion-col size="6">

                              <ion-item *ngFor="let destination of destinationOptions" lines="none">
                                  <ion-button
                                          [class.selected]="selectedDestination === destination"
                                          [color]="selectedDestination === destination ? 'success' : 'light'"
                                          (click)="selectDestination(destination)"

                                  >
                                      {{ destination }}
                                  </ion-button>
                              </ion-item>

                          </ion-col>

                          <ion-col size="6">

                              <ion-item *ngFor="let direction of directionOptions" lines="none">
                                  <ion-button
                                          [class.selected]="selectedDirection === direction"
                                          [color]="selectedDirection === direction ? 'success' : 'light'"
                                          (click)="selectDirection(direction)"

                                  >
                                      {{ direction }}
                                  </ion-button>
                              </ion-item>

                          </ion-col>

                      </ion-row>

                  </ion-grid>
              </ion-card-content>
          </ion-card>

          <ion-button [disabled]="!areSelectionsMade()" (click)="goToNextComponent()">Next</ion-button>
      </ion-content>`,
  styleUrls: ['./shot-destination-and-direction.component.scss'],
})
export class ShotDestinationAndDirectionComponent  implements OnInit {
  destinationOptions: string[] = ['Net', 'Wide', 'Long', 'In'];
  directionOptions: string[] = ['Middle', 'Down the Line', 'Crosscourt'];
  selectedDestination: string | undefined;
  selectedDirection: string | undefined;
  constructor() { }

  ngOnInit() {}


  selectDestination(destination: string) {
    this.selectedDestination = destination;
  }

  selectDirection(direction: string) {
    this.selectedDirection = direction;
  }

  areSelectionsMade(): boolean {
    return !!this.selectedDestination && !!this.selectedDirection;
  }

  async goToNextComponent()
  {

  }
}
