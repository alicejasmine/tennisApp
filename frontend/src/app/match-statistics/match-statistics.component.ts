import {Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../data.service";
import {MatchWithPlayers} from "../models";
import {firstValueFrom} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {DeleteMatchComponent} from "../delete-match/delete-match.component";
import {ModalController} from "@ionic/angular";
import {ChartOptions} from "chart.js";
import {ShotService} from "src/services/shot.service";

@Component({
  selector: 'app-match-statistics',
  templateUrl: './match-statistics.component.html',
  styleUrl: './match-statistics.component.scss'
})

export class MatchStatisticsComponent implements OnInit {
  title = 'ng2-charts-demo';


  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartLabels = ['Winner', 'Forced Error', 'Unforced Error'];
  public pieChartDatasets = [{
    data: [0, 0, 0]
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(public http: HttpClient, public dataService: DataService, public route: ActivatedRoute, public router: Router, public modalController: ModalController, public shotService: ShotService) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  async getMatchStatistics() {
    try {
      const id = (await firstValueFrom(this.route.paramMap)).get('id');
      this.dataService.currentMatch = (await firstValueFrom(this.http.get<MatchWithPlayers>('/api/matches/' + id)));
    } catch (e) {
      this.router.navigate(['']);
    }
  }

  async openDeleteConfirmation(matchId: number | undefined) {
    if (matchId !== undefined) {
      const currentMatchToDelete = this.dataService.currentMatch.id;
      if (currentMatchToDelete) {
        const modal = await this.modalController.create({
          component: DeleteMatchComponent
        });
        modal.present();
      }
    }
  }


  getMatchDuration(): string {
    if (this.dataService.currentMatch.startTime && this.dataService.currentMatch.endTime) {
      const startTime = new Date(this.dataService.currentMatch.startTime);
      const endTime = new Date(this.dataService.currentMatch.endTime);
      const durationInMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;

      return `${hours}h ${minutes}m`;
    }
    return '';

  }

  async loadGraphs() {
    try {
      if (this.dataService.currentMatch.playerId1 && this.dataService.currentMatch.id) {
        await this.shotService.countShotsForPlayerByMatch(this.dataService.currentMatch.playerId1, this.dataService.currentMatch.id);
        this.pieChartDatasets = [{
          data: [this.shotService.winnerCount, this.shotService.forcedErrorCount, this.shotService.unforcedErrorCount]
        }];

      }
    } catch (error) {
      console.error('Error counting shots:', error);
    }
  }

  async loadData() {
    try {
      await this.getMatchStatistics();
      if (this.dataService.currentMatch.finished == true) { //load data only when match is done
        this.loadGraphs();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

}
