import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {DataService} from 'src/app/data.service';

@Component({
  selector: 'app-shot-destination-and-direction',
  template: `

    <ion-content style="--padding-top: 105px;">
        <ion-toolbar>
            <ion-title>Shot Destination and Direction</ion-title>
        </ion-toolbar>
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

      <ion-button [disabled]="!areSelectionsMade()"
                  (click)="registerShotDirectionAndDestination(selectedDirection, selectedDestination)">Next
      </ion-button>
    </ion-content>`,
  styleUrls: ['./shot-destination-and-direction.component.scss'],
})
export class ShotDestinationAndDirectionComponent {
  destinationOptions: string[] = ['Net', 'Wide', 'Long', 'Not Applicable'];
  directionOptions: string[] = ['Middle', 'Down The Line', 'Cross Court'];
  selectedDestination: string | undefined;
  selectedDirection: string | undefined;

  constructor(public route: ActivatedRoute,
              public router: Router,
              public dataService: DataService,
              public httpClient: HttpClient) {
  }


  selectDestination(destination: string) {
    this.selectedDestination = destination;
  }

  selectDirection(direction: string) {
    this.selectedDirection = direction;
  }

  areSelectionsMade(): boolean {
    return !!this.selectedDestination && !!this.selectedDirection;
  }

  registerShotDirectionAndDestination(shotDirection: string | undefined, shotDestination: string | undefined) {
    this.dataService.currentShot.shotDirection = shotDirection;
    this.dataService.currentShot.shotDestination = shotDestination;
    this.selectedDestination = undefined; //clear buttons
    this.selectedDirection = undefined;
    this.router.navigate(['/tabs/player-position/' + this.dataService.currentMatch.id + '/' + this.dataService.currentShot.playerId]);

  }
}
