import {Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../data.service";
import {MatchWithPlayers} from "../models";
import {firstValueFrom} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-match-statistics',
  templateUrl: './match-statistics.component.html'
})

export class MatchStatisticsComponent implements OnInit {
  match: MatchWithPlayers | undefined;

  constructor(public http: HttpClient, public dataService: DataService, public activatedRoute: ActivatedRoute) {
    this.setId();
  }

  ngOnInit() {
    this.getMatchInfo();
  }

  async getMatchInfo() {
    this.activatedRoute.params.subscribe(async (params) => {
      const matchId = params['matchId'];
      if (matchId) {
        const call = this.http.get<MatchWithPlayers>('/api/matches/' + matchId);
        this.match = await firstValueFrom<MatchWithPlayers>(call);
      }
      console.log(this.match)
    });
  }

  async setId() {
    try {
      const id = (await firstValueFrom(this.activatedRoute.paramMap)).get('matchId');
      this.dataService.currentMatch = (await firstValueFrom(this.http.get<any>('/api/matches/' + id)));
    } catch (e) {
      console.log(e);
    }
  }
}
