import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController, ToastController} from '@ionic/angular';
import {DataService} from '../data.service';
import { Player } from '../models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-player',
  template: `
      <ion-content class="ion-padding" fullscreen="true">
          <ion-list>
              <ion-item>
                  <ion-input [formControl]="fullnameForm" label="Fullname" placeholder="enter text"> </ion-input>
              </ion-item>
              <ion-button [disabled]="PlayerForm.invalid" type="submit" (click)="submitCreatePlayer()"> Create
              </ion-button>
              <ion-button (click)="modalController.dismiss()">Close</ion-button>
          </ion-list>
      </ion-content>`,

  styleUrls: ['./create-player.component.scss'],
})
export class CreatePlayerComponent {
  fullnameForm = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  PlayerForm = new FormGroup({
    fullName: this.fullnameForm,

  })


  constructor(public modalController: ModalController,
              public dataService: DataService,
              public toastController: ToastController,
              public http: HttpClient) {
  }


  async submitCreatePlayer() {
    try {
      const call = this.http.post<Player>('api/players', this.PlayerForm.getRawValue())
      const result = await firstValueFrom<Player>(call);
      this.dataService.players.push(result);
      const toast = await this.toastController.create({
        color: 'success',
        duration: 2000,
        message: "Success"
      })
      toast.present();
      this.modalController.dismiss();
    }catch (error: any) {
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
