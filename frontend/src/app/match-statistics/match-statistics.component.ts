import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../data.service";
import {MatchWithPlayers} from "../models";
import {firstValueFrom} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-match-statistics',
  templateUrl: './match-statistics.component.html'
})

export class MatchStatisticsComponent {

  constructor(public http: HttpClient, public dataService: DataService, public route: ActivatedRoute, public router: Router ) {
    this.getMatchStatistics();
  }

  async getMatchStatistics() {
    try {
      const id = (await firstValueFrom(this.route.paramMap)).get('id');
      this.dataService.currentMatch = (await firstValueFrom(this.http.get<MatchWithPlayers>('/api/matches/' + id)));
      console.log(this.dataService.currentMatch)
      console.log(id)
    } catch (e) {
      this.router.navigate(['']);
    }
  }
}
