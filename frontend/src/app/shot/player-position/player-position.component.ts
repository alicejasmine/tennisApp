import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {DataService} from 'src/app/data.service';
import {ShotService} from 'src/services/shot.service';
import {ModalController} from '@ionic/angular';
import {EditEndingMatchComponent} from 'src/app/edit-match/edit-ending-match.component';



@Component({
  selector: 'app-player-position',
  template: `


    <ion-header>
      <ion-toolbar>
        <ion-title>Player Position</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-item>
      <ion-button (click)="registerPlayerPosition(selectedArea)" [disabled]="!selectedArea" color="primary">Next Point
      </ion-button>
      <ion-button (click)="endMatchModal(selectedArea)" [disabled]="!selectedArea" color="danger">End Match</ion-button>

    </ion-item>

    <ion-content>


      <img src="assets/img/tennis_court_color.png" alt="Tennis Court"
           style="width: auto; height: auto; position: relative;">
      <ion-button
        [class.selected]="selectedArea === 'Green'"
        (click)="selectCourtArea('Green')"
        [style.background-color]="selectedArea === 'Green' ? 'rgba(0, 255, 0, 0.3)' : 'transparent'"
        style="position: absolute; left: 1%; top: 3%; width: 31%; height: 18%;   border: 2px solid rgba(0, 255, 0, 1); border-radius: 10px;cursor: pointer;">
      </ion-button>
      <ion-button
        [class.selected]="selectedArea === 'Yellow'"
        (click)="selectCourtArea('Yellow')"
        [style.background-color]="selectedArea === 'Yellow' ? 'rgba(255, 255, 0, 0.3)' : 'transparent'"
        style="position: absolute; left: 1%; top: 22%; width: 31%; height: 50%;  border: 2px solid rgba(255, 255, 0, 1); border-radius: 10px; cursor: pointer;">

      </ion-button>


      <ion-button
        [class.selected]="selectedArea === 'Red'"
        (click)="selectCourtArea('Red')"
        [style.background-color]="selectedArea === 'Red' ? 'rgba(255, 0, 0, 0.3)' : 'transparent'"
        style="position: absolute; left: 1%; top: 73%; width: 31%; height: 22%; border: 2px solid rgba(255, 0, 0, 1); border-radius: 10px; cursor: pointer;">
      </ion-button>


    </ion-content>
  `,
  styleUrls: ['./player-position.component.scss'],
})
export class PlayerPositionComponent {
  selectedArea: string | undefined;

  constructor(public route: ActivatedRoute,
              public router: Router,
              public dataService: DataService,
              public modalCtrl: ModalController,
              public shotService: ShotService,
              public httpClient: HttpClient,
              ) {
  }

  selectCourtArea(area: string) {
    this.selectedArea = area;
  }


  registerPlayerPosition(playerPosition: string | undefined) {
    this.dataService.currentShot.playerPosition = playerPosition;
    this.shotService.registerShot();
    console.log(this.dataService.currentShot)
    this.router.navigate(['/shot-classification/' + this.dataService.currentMatch.id]);
    this.dataService.currentShot = {}; //clear current shot so a new one can be registered
    this.selectedArea = undefined; //clear button
  }


  async endMatchModal(playerPosition: string | undefined) {
    const modal = await this.modalCtrl.create({
      component: EditEndingMatchComponent,
    });
    this.dataService.currentShot.playerPosition = playerPosition;
    this.shotService.registerShot();
    this.dataService.currentMatch.finished = true;

    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() + 1);
    this.dataService.currentMatch.endTime=currentDateTime;
    await modal.present();
  }


}
