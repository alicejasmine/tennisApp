import {Component,OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {ModalController} from "@ionic/angular";
import {CreateMatchComponent} from "../create-match/create-match.component";
import {EditMatchComponent} from "../edit-match/edit-match.component";
import {ActivatedRoute} from '@angular/router';
import {MatchWithPlayers, Role} from "../models";



@Component({
  selector: 'app-home',
  template: `
    <ion-content style="--padding-top: 105px;">
    <ion-grid>
          <div class="container">
            <ion-searchbar [value]="fullName" animated="true" placeholder="Search match"
                           (ionInput)="handleSearch($event)" data-testid="search-bar"></ion-searchbar>
              <ion-button class="createMatchButton" *appUserRole="[Role.Admin]" (click)="openModalCreateMatch()">Create Match</ion-button>
          </div>
    </ion-grid>
    <ion-grid>
      <ion-row>

                  <ion-col size="12" size-sm="12" size-md="6" size-lg="4"
                           *ngFor="let match of dataService.matchesWithPlayers">
                      <ion-card>
                          <ion-card-header>

                              <ion-card-title (click)="goToMatch(match.id)">{{match.date| date:'dd-MM-yyyy'}}
                                  || {{match.fullNamePlayer1}}
                                  VS {{match.fullNamePlayer2}}</ion-card-title>
                          </ion-card-header>
                              <ion-button *appUserRole="[Role.Admin]" fill="clear" (click)="openModalEditMatch(match.id)">Update</ion-button>

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
              public modalController: ModalController,
              private route: ActivatedRoute) {
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
      component: CreateMatchComponent,
      cssClass: 'modal-css'
    });
    modal.present();
  }

  async openModalEditMatch(matchId: number | undefined) {
    if (matchId !== undefined) {
      const currentMatchToEdit = this.dataService.matchesWithPlayers.find(match => match.id === matchId);
      if (currentMatchToEdit) {
        this.dataService.currentMatch = currentMatchToEdit;
        const modal = await this.modalController.create({
          component: EditMatchComponent,
          cssClass: 'modal-css'
        });
        modal.present();
      }
    }
  }

  async goToMatch(matchId:number|undefined){
    this.dataService.currentMatch = (await firstValueFrom(this.http.get<MatchWithPlayers>('/api/matches/' + matchId)));
    this.router.navigate(['/tabs/match-info/'+ matchId]);

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

  protected Role = Role;
}
