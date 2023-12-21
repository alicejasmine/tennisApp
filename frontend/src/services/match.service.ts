import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, catchError, firstValueFrom} from 'rxjs';
import { DataService } from 'src/app/data.service';

import {ModalController, ToastController} from "@ionic/angular";
import { MatchWithPlayers } from 'src/app/models';
import {FormGroup} from "@angular/forms";



@Injectable({
  providedIn: 'root',
})
export class MatchService {

  constructor(private httpClient: HttpClient, public dataService: DataService, public toastController: ToastController,public modalController:ModalController) {
  }

  async editMatch(editMatchForm: FormGroup) {
    try {
      const call = this.httpClient.put<MatchWithPlayers>('/api/matches/' + this.dataService.currentMatch.id, editMatchForm.value);
      const result = await firstValueFrom<MatchWithPlayers>(call);
      let index = this.dataService.matchesWithPlayers.findIndex(m => m.id == this.dataService.currentMatch.id)
      this.dataService.matchesWithPlayers[index] = result;
      this.dataService.currentMatch = result;
      this.modalController.dismiss();
      const toast = await this.toastController.create({
        message: 'Match updated',
        duration: 1000,
        color: 'success'
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
        duration: 2000,
        message: errorMessage
      });

      toast.present();
    }
}
}
