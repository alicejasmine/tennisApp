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
}
 
