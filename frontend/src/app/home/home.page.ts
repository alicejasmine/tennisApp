import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {HttpClient} from "@angular/common/http";
import {MatchWithPlayers} from "../../models";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";
import {ModalController} from "@ionic/angular";
import {CreateMatchComponent} from "../create-match/create-match.component";
import {EditMatchComponent} from "../edit-match/edit-match.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public router: Router,
              public dataService: DataService,
              public http: HttpClient,
              public modalController: ModalController) {
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
}
