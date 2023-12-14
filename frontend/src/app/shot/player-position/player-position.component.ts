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
          <ion-button (click)="endMatchModal(selectedArea)" [disabled]="!selectedArea" color="danger">End Match
          </ion-button>
      </ion-item>

      <ion-content>
          <div class="court">
              <svg  data-testid="Green" [class.selected]="selectedArea === 'Green'"
                   (click)="selectCourtArea('Green')"
                   [style.border]="selectedArea === 'Green' ? '10px solid green' : 'transparent'" width="20vw"
                   viewBox="0 0 855 233" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"
                   style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect  x="0" y="0" width="854.627" height="1043.69" style="fill:#66d47d;"/>
                  <g><path d="M117.5,2.92l-0,1037.62" style="fill:none;stroke:#fff;stroke-width:6.25px;"/>
                      <path d="M747.497,3.045l0,1037.31" style="fill:none;stroke:#fff;stroke-width:6.25px;"/>
                      <path d="M424.646,3.092l0,612.361" style="fill:none;stroke:#fff;stroke-width:6.25px;"/></g>
                  <rect x="0" y="0" width="854.627" height="232.409" style="fill:none;"/>
                  <rect x="0" y="2.92" width="854.627" height="229.489" style="fill:none;"/></svg>
            <br>
              <svg data-testid="Yellow"[class.selected]="selectedArea === 'Yellow'"
                   (click)="selectCourtArea('Yellow')"
                   [style.border]="selectedArea === 'Yellow' ? '10px solid yellow' : 'transparent'" width="20vw"
                   viewBox="0 0 855 613" version="1.1" xmlns="http://www.w3.org/2000/svg"
                   xml:space="preserve"
                   style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect x="0" y="-232.409" width="854.627" height="1043.69" style="fill:#ebdc55;"/>
                  <g><path d="M117.5,-229.489l-0,1037.62" style="fill:none;stroke:#fff;stroke-width:6.25px;"/>
                      <path d="M117.5,383.77l629.793,-0" style="fill:none;stroke:#fff;stroke-width:6.25px;"/>
                      <path d="M747.497,-229.365l0,1037.31" style="fill:none;stroke:#fff;stroke-width:6.25px;"/>
                      <path d="M424.646,-229.317l0,612.361" style="fill:none;stroke:#fff;stroke-width:6.25px;"/></g>
                  <rect x="-0" y="-0" width="854.627" height="612.487" style="fill:none;"/>
                  <rect x="0" y="-229.489" width="854.627" height="229.489" style="fill:none;"/></svg>
            <br>
              <svg data-testid="Red" [class.selected]="selectedArea === 'Red'"
                   (click)="selectCourtArea('Red')"
                   [style.border]="selectedArea === 'Red' ? '10px solid red' : 'transparent'" width="20vw"
                   viewBox="0 0 855 199" version="1.1" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"
                   style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect x="0" y="-844.897" width="854.627" height="1043.69" style="fill:#d84435;"/>
                  <g><path d="M117.5,-841.976l-0,1037.62" style="fill:none;stroke:#fff;stroke-width:6.25px;"/>
                      <path d="M747.497,-841.852l0,1037.31" style="fill:none;stroke:#fff;stroke-width:6.25px;"/></g>
                  <rect x="0" y="0" width="854.627" height="198.792" style="fill:none;"/></svg>
          </div>
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
    this.dataService.currentMatch.finished = true;

    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() + 1);
    this.dataService.currentMatch.endTime=currentDateTime;
    await modal.present();
  }


}
