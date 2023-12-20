import {Component} from "@angular/core";
import {DataService} from "../data.service";
import {firstValueFrom} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ModalController, ToastController} from "@ionic/angular";
import {Router} from "@angular/router";


@Component({
  selector: 'app-delete-match',
  templateUrl: './delete-match.component.html',
})

export class DeleteMatchComponent {
  constructor(public http: HttpClient, public dataService: DataService, public toastController: ToastController, public router: Router, public modalController : ModalController) {
  }

  async deleteMatch(matchId: number | undefined) {
    try {
      await firstValueFrom(this.http.delete('/api/matches/' + matchId))
      this.dataService.matchesWithPlayers=this.dataService.matchesWithPlayers.filter(a => a.id!=matchId);
      this.modalController.dismiss();
      this.router.navigate(['']);

      const toast = await this.toastController.create({
        message: 'Match was deleted',
        duration: 1200,
        color: 'success'
      })
      toast.present();
    } catch (error: any) {

      let errorMessage = 'Error';

      if (error instanceof HttpErrorResponse) {

        errorMessage = error.error?.message || 'Server error';
      } else if (error.error instanceof ErrorEvent) {

        errorMessage = error.error.message;
      }

      const toast = await this.toastController.create({
        color: 'danger',
        duration: 2000,
        message: errorMessage
      });

      toast.present();
    }
  }
}
