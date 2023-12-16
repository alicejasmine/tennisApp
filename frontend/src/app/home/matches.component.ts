import {Component,OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";
import {ModalController} from "@ionic/angular";
import {CreateMatchComponent} from "../create-match/create-match.component";
import {EditMatchComponent} from "../edit-match/edit-match.component";
import {ActivatedRoute} from '@angular/router';
import {MatchWithPlayers} from "../models";


@Component({
  selector: 'app-home',
  template: `
    <app-title [title]="'Home'"></app-title>
    <ion-content [fullscreen]="true">
    <ion-grid>
          <div class="container">
            <ion-searchbar [value]="fullName" animated="true" placeholder="Search match"
                           (ionInput)="handleSearch($event)" data-testid="search-bar"></ion-searchbar>
            <ion-button class="createMatchButton" (click)="openModalCreateMatch()">Create Match</ion-button>
          </div>
    </ion-grid>
    <ion-grid>
      <ion-row>
        <ion-col size="4" *ngFor="let match of dataService.matchesWithPlayers">
          <ion-card>
            <ion-card-header>
              <ion-card-title routerLink="/match-info/{{match.id}}">{{match.date| date:'dd-MM-yyyy'}} || {{match.fullNamePlayer1}}
                VS {{match.fullNamePlayer2}}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-button (click)="openModalEditMatch(match.id)">Edit</ion-button>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>

  </ion-content>
`,
  styleUrls: ['home.page.scss'],
})
export class MatchesComponent implements OnInit {
  fullName: string | undefined;
  fillSearchBar: boolean | undefined;



  constructor(public router: Router,
              public dataService: DataService,
              public http: HttpClient,
              public modalController: ModalController,private route: ActivatedRoute) {
    this.getMatches();
  }

  async getMatches() {
    const call = this.http.get<MatchWithPlayers[]>('/api/matches');
    this.dataService.matchesWithPlayers = await firstValueFrom<MatchWithPlayers[]>(call);
  }

  async handleSearch($event: any) {
    const query = $event.target.value;
    const call = this.http.get<MatchWithPlayers[]>(`/api/matches/search?SearchTerm=${query}`);
    this.dataService.matchesWithPlayers = await firstValueFrom<MatchWithPlayers[]>(call);
  }

  async openModalCreateMatch() {
    const modal = await this.modalController.create({
      component: CreateMatchComponent
    });
    modal.present();
  }

  async openModalEditMatch(matchId: number | undefined) {
    if (matchId !== undefined) {
      const currentMatchToEdit = this.dataService.matchesWithPlayers.find(match => match.id === matchId);
      if (currentMatchToEdit) {
        this.dataService.currentMatch = currentMatchToEdit;
        const modal = await this.modalController.create({
          component: EditMatchComponent
        });
        modal.present();
      }
    }
  }



  async goToAllPlayers() {
    this.router.navigate(['/all-players']);

  }


  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.fullName = params['fullName'];
      this.fillSearchBar = params['fillSearchBar'] === 'true';
      if (this.fillSearchBar) {
        this.handleSearch({ target: { value: this.fullName } });
      }
    });
  }
}
