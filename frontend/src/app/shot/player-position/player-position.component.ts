import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-player-position',
    template: `


        <ion-header>
            <ion-toolbar>
                <ion-title>Player Position</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-button (click)="endMatch()" color="danger">End Match</ion-button>
            <ion-button (click)="updateNotes()" color="tertiary">Update Notes</ion-button>

            <ion-card>
                <ion-card-content>

                    <img src="assets/img/tennis_court.png" alt="Tennis Court"
                         style="width: 20%; height: auto; position: relative;">
                    <ion-button
                            [class.selected]="selectedArea === 'green'"
                            (click)="selectCourtArea('green')"
                            style="position: absolute; left: 2%; top: 3%; width: 18%; height: 18%; background: rgba(0, 0, 0, 0); border: none; cursor: pointer;"
                    >

                    </ion-button>

                    <ion-button
                            [class.selected]="selectedArea === 'yellow'"
                            (click)="selectCourtArea('yellow')"
                            style="position: absolute; left: 2%; top: 22%; width: 18%; height: 38%; background: rgba(0, 0, 0, 0); border: none; cursor: pointer;"
                    >

                    </ion-button>


                    <ion-button
                            [class.selected]="selectedArea === 'red'"
                            (click)="selectCourtArea('red')"
                            style="position: absolute; left: 2%; top: 60%; width: 18%; height: 27%; background: rgba(0, 0, 0, 0); border: none; cursor: pointer;"
                    >

                    </ion-button>

                </ion-card-content>
            </ion-card>

            <ion-button (click)="goToNextPoint()" [disabled]="!selectedArea" color="primary">Next Point</ion-button>
        </ion-content>
    `,
    styleUrls: ['./player-position.component.scss'],
})
export class PlayerPositionComponent implements OnInit {
    selectedArea: string | undefined;

    constructor() {
    }

    ngOnInit() {
    }

    selectCourtArea(area: string) {
        this.selectedArea = area;
    }


    async goToNextPoint() {
    }

    async endMatch() {
    }

    async updateNotes() {
    }
}
