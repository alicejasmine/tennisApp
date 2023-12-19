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
  graphsLoaded = false;

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  }

  public pieChartLabelClassification = ['Winner', 'Forced Error', 'Unforced Error'];
  public pieChartLabelType = [
    'Forehand Groundstroke', 'Forehand Return ',
    'Serve Deuce ', 'Serve Add',
    'Backhand Groundstroke', 'Backhand Return ',
    'Forehand Volley', 'Backhand Volley ',
    'Overhead ', 'Other'
  ];
  public pieChartDataset1 = [{
    data: [0, 0, 0],
  }];
  public pieChartDataset2 = [{
    data: [0, 0, 0]
  }];
  public pieChartDatasetWinner1 = [{
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }];
  public pieChartDatasetWinner2 = [{
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }];

  public pieChartDatasetFE1 = [{
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }];
  public pieChartDatasetFE2 = [{
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }];

  public pieChartDatasetUE1 = [{
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }];
  public pieChartDatasetUE2 = [{
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }];
  public pieChartLegend = true;

  constructor(public http: HttpClient, public dataService: DataService, public route: ActivatedRoute, public router: Router, public modalController: ModalController, public shotService: ShotService) {

  }

  ngOnInit(): void {
    this.getMatchStatistics();
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
    this.shotService.resetCount();
    if (this.dataService.currentMatch.finished) {
      this.graphsLoaded = true;
      if (this.dataService.currentMatch.playerId1 && this.dataService.currentMatch.playerId2 && this.dataService.currentMatch.id) {
        await this.shotService.countShotsForPlayerByMatch(this.dataService.currentMatch.playerId1, this.dataService.currentMatch.id);
        await this.shotService.countShotsForPlayerByMatch(this.dataService.currentMatch.playerId2, this.dataService.currentMatch.id);
      }
      this.pieChartDataset1 = [{
        data: [this.shotService.winnerCountPlayer1, this.shotService.forcedErrorCountPlayer1, this.shotService.unforcedErrorCountPlayer1]
      }];

      this.pieChartDataset2 = [{
        data: [this.shotService.winnerCountPlayer2, this.shotService.forcedErrorCountPlayer2, this.shotService.unforcedErrorCountPlayer2]
      }];

      this.winnerGraphs();
      this.feGraphs();
      this.ueGraphs();


    }
  }



  winnerGraphs() {
    this.pieChartDatasetWinner1 = [{
      data: [
        this.shotService.forehandGroundstrokeWinnerCountPlayer1,
        this.shotService.forehandReturnWinnerCountPlayer1,
        this.shotService.serveDeuceWinnerCountPlayer1,
        this.shotService.serveAddWinnerCountPlayer1,
        this.shotService.backhandGroundstrokeWinnerCountPlayer1,
        this.shotService.backhandReturnWinnerCountPlayer1,
        this.shotService.forehandVolleyWinnerCountPlayer1,
        this.shotService.backhandVolleyWinnerCountPlayer1,
        this.shotService.overheadWinnerCountPlayer1,
        this.shotService.otherWinnerCountPlayer1,
      ]
    }];

    this.pieChartDatasetWinner2 = [{
      data: [
        this.shotService.forehandGroundstrokeWinnerCountPlayer2,
        this.shotService.forehandReturnWinnerCountPlayer2,
        this.shotService.serveDeuceWinnerCountPlayer2,
        this.shotService.serveAddWinnerCountPlayer2,
        this.shotService.backhandGroundstrokeWinnerCountPlayer2,
        this.shotService.backhandReturnWinnerCountPlayer2,
        this.shotService.forehandVolleyWinnerCountPlayer2,
        this.shotService.backhandVolleyWinnerCountPlayer2,
        this.shotService.overheadWinnerCountPlayer2,
        this.shotService.otherWinnerCountPlayer2,
      ]
    }];
  }

  feGraphs() {
    this.pieChartDatasetFE1 = [{
      data: [
        this.shotService.forehandGroundstrokeFECountPlayer1,
        this.shotService.forehandReturnFECountPlayer1,
        this.shotService.serveDeuceFECountPlayer1,
        this.shotService.serveAddFECountPlayer1,
        this.shotService.backhandGroundstrokeFECountPlayer1,
        this.shotService.backhandReturnFECountPlayer1,
        this.shotService.forehandVolleyFECountPlayer1,
        this.shotService.backhandVolleyFECountPlayer1,
        this.shotService.overheadFECountPlayer1,
        this.shotService.otherFECountPlayer1,
      ]
    }];

    this.pieChartDatasetFE2 = [{
      data: [
        this.shotService.forehandGroundstrokeFECountPlayer2,
        this.shotService.forehandReturnFECountPlayer2,
        this.shotService.serveDeuceFECountPlayer2,
        this.shotService.serveAddFECountPlayer2,
        this.shotService.backhandGroundstrokeFECountPlayer2,
        this.shotService.backhandReturnFECountPlayer2,
        this.shotService.forehandVolleyFECountPlayer2,
        this.shotService.backhandVolleyFECountPlayer2,
        this.shotService.overheadFECountPlayer2,
        this.shotService.otherFECountPlayer2,
      ]
    }];
  }

  ueGraphs() {
    this.pieChartDatasetUE1 = [{
      data: [
        this.shotService.forehandGroundstrokeUECountPlayer1,
        this.shotService.forehandReturnUECountPlayer1,
        this.shotService.serveDeuceUECountPlayer1,
        this.shotService.serveAddUECountPlayer1,
        this.shotService.backhandGroundstrokeUECountPlayer1,
        this.shotService.backhandReturnUECountPlayer1,
        this.shotService.forehandVolleyUECountPlayer1,
        this.shotService.backhandVolleyUECountPlayer1,
        this.shotService.overheadUECountPlayer1,
        this.shotService.otherUECountPlayer1,
      ]
    }];

    this.pieChartDatasetUE2 = [{
      data: [
        this.shotService.forehandGroundstrokeUECountPlayer2,
        this.shotService.forehandReturnUECountPlayer2,
        this.shotService.serveDeuceUECountPlayer2,
        this.shotService.serveAddUECountPlayer2,
        this.shotService.backhandGroundstrokeUECountPlayer2,
        this.shotService.backhandReturnUECountPlayer2,
        this.shotService.forehandVolleyUECountPlayer2,
        this.shotService.backhandVolleyUECountPlayer2,
        this.shotService.overheadUECountPlayer2,
        this.shotService.otherUECountPlayer2,
      ]
    }];
  }
}
