

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
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
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


  async handleInput($event: any) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.fullName = params['fullName'];
      this.fillSearchBar = params['fillSearchBar'] === 'true';
    });
  }
}

