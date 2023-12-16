import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, catchError, firstValueFrom} from 'rxjs';
import { DataService } from 'src/app/data.service';
import { Shot } from 'src/app/models';
import {ToastController} from "@ionic/angular";



@Injectable({
  providedIn: 'root',
})
export class ShotService {
  public winnerCount = 0;
  public forcedErrorCount = 0;
  public unforcedErrorCount = 0;
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

      this.winnerCount = 0;
      this.forcedErrorCount = 0;
      this.unforcedErrorCount = 0;

      shots.forEach((shot) => {
        this.updateShotClassificationCount(shot.shotClassification);
      });
    } catch (error) {
      console.error('Error counting shots:', error);

    }
  }
  private updateShotClassificationCount(shotClassification: string| undefined) {
    switch (shotClassification) {
      case 'Winner':
        this.winnerCount++;
        break;
      case 'Forced Error':
        this.forcedErrorCount++;
        break;
      case 'Unforced Error':
        this.unforcedErrorCount++;
        break;
    }
  }
  }
