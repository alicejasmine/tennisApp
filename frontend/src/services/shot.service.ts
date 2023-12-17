import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, catchError, firstValueFrom} from 'rxjs';
import {DataService} from 'src/app/data.service';
import {Shot} from 'src/app/models';
import {ToastController} from "@ionic/angular";


@Injectable({
  providedIn: 'root',
})
export class ShotService {
  public winnerCountPlayer1 = 0;
  public forcedErrorCountPlayer1 = 0;
  public unforcedErrorCountPlayer1 = 0;
  public winnerCountPlayer2 = 0;
  public forcedErrorCountPlayer2 = 0;
  public unforcedErrorCountPlayer2 = 0;

  constructor(private httpClient: HttpClient, public dataService: DataService, public toastController: ToastController,) {
  }

  async registerShot() {

    const playerId = this.dataService.currentShot.playerId;
    const matchId = this.dataService.currentShot.matchId;

    const shotData = {
      ShotClassification: this.dataService.currentShot.shotClassification,
      ShotType: this.dataService.currentShot.shotType,
      ShotDestination: this.dataService.currentShot.shotDestination,
      ShotDirection: this.dataService.currentShot.shotDirection,
      PlayerPosition: this.dataService.currentShot.playerPosition,
    };
    try {

      const call = this.httpClient.post<Shot>(`/api/shots/${playerId}/${matchId}/shots`, shotData);
      const result = await firstValueFrom<Shot>(call);
      this.dataService.shots.push(result);
      const toast = await this.toastController.create({
        color: 'success',
        duration: 2000,
        message: "Success"
      })
      toast.present();
    } catch (error: any) {
      console.log(error);
      let errorMessage = 'Error';

      if (error instanceof HttpErrorResponse) {
        // The backend returned an unsuccessful response code.
        errorMessage = error.error?.message || 'Server error';
      } else if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred.
        errorMessage = error.error.message;
      }

      const toast = await this.toastController.create({
        color: 'danger',
        duration: 200000,
        message: errorMessage
      });

      toast.present();
    }
  }


  async countShotsForPlayerByMatch(playerId: number, matchId: number) {
    try {
      const call = `/api/shots/${playerId}/${matchId}/shots`;
      const shots = await firstValueFrom(this.httpClient.get<Shot[]>(call));


      this.resetCount(playerId);
      shots.forEach((shot) => {
        this.updateShotClassificationCount(shot.playerId, shot.shotClassification);
      });
    } catch (error) {
      console.error('Error counting shots:', error);

    }
  }

  private updateShotClassificationCount(playerId: number | undefined, shotClassification: string | undefined) {
    switch (shotClassification) {
      case 'Winner':
        if (playerId === this.dataService.currentMatch.playerId1) {
          this.winnerCountPlayer1++;
        } else if (playerId === this.dataService.currentMatch.playerId2) {
          this.winnerCountPlayer2++;
        }
        break;
      case 'Forced Error':
        if (playerId === this.dataService.currentMatch.playerId1) {
          this.forcedErrorCountPlayer1++;
        } else if (playerId === this.dataService.currentMatch.playerId2) {
          this.forcedErrorCountPlayer2++;
        }
        break;
      case 'Unforced Error':
        if (playerId === this.dataService.currentMatch.playerId1) {
          this.unforcedErrorCountPlayer1++;
        } else if (playerId === this.dataService.currentMatch.playerId2) {
          this.unforcedErrorCountPlayer2++;
        }
        break;
    }
  }


  private resetCount(playerId: number) {
    if (playerId == this.dataService.currentMatch.playerId1) {
      this.winnerCountPlayer1 = 0;
      this.forcedErrorCountPlayer1 = 0;
      this.unforcedErrorCountPlayer1 = 0;
    } else if (playerId == this.dataService.currentMatch.playerId2) {
      this.winnerCountPlayer2 = 0;
      this.forcedErrorCountPlayer2 = 0;
      this.unforcedErrorCountPlayer2 = 0;
    }
  }
}
