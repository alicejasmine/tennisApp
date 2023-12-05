import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {DataService} from '../data.service';
import {Match} from '../models';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-player-matches',
  template: `

    <ion-content class="ion-padding" fullscreen="true">
      <div>
        <ion-searchbar animated="true" placeholder="Search matches" debounce="100"
                       (ionInput)="handleInput($event)"></ion-searchbar>
      </div>
      <div>
        <ion-card *ngFor="let match of dataService.matches">
          <ion-card-header>
            <ion-card-title>{{match.date| date:'dd-MM-yyyy'}}</ion-card-title>
          </ion-card-header>

          <ion-button fill="clear" (click)="openEditMatch(match.id)">Update</ion-button>

        </ion-card>
      </div>

    </ion-content>`,
  styleUrls: ['./player-matches.component.scss'],
})
export class PlayerMatchesComponent implements OnInit {

  constructor(public modalController: ModalController,
              public activatedRoute: ActivatedRoute,
              public router: Router,
              public dataService: DataService,
              public http: HttpClient) {
    this.getPlayerMatches();
  }

  async getPlayerMatches() {
    this.activatedRoute.params.subscribe(async (params) => {
      const playerId = params['playerId'];
      if (playerId) {
        const call = this.http.get<Match[]>('api/matchesforplayer/' + playerId);
        this.dataService.matches = await firstValueFrom<Match[]>(call);
      }
    });
  }

  ngOnInit() {
  }


  async openEditMatch(Id: number | undefined) {

  }

  async handleInput($event: any) {
    /*
    const query = $event.target.value;
    const call = this.http.get<[]>(`api//search?SearchTerm=${query}`);
    this.dataService.players = await firstValueFrom<[]>(call);
     */
  }
}
