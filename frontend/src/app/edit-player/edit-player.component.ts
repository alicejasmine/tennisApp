import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController, ToastController} from "@ionic/angular";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DataService} from '../data.service';
import {Player} from '../models';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-edit-player',
  template: `
    <ion-content class="ion-padding" fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-input [formControl]="editPlayerForm.controls.fullname" label="Fullname:"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-select [formControl]="editPlayerForm.controls.active" placeholder="Select player status">
            <ion-select-option [value]="true">active</ion-select-option>
            <ion-select-option [value]="false">not active</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-button [disabled]="editPlayerForm.invalid" type="submit" (click)="submitEditPlayer()"> Update
        </ion-button>
        <ion-button (click)="modalController.dismiss()">Close</ion-button>
      </ion-list>
    </ion-content>`,
  styleUrls: ['./edit-player.component.scss'],
})
export class EditPlayerComponent implements OnInit {

  editPlayerForm = this.formBuilder.group({
    fullname: [this.dataService.currentPlayer.fullName, [Validators.required, Validators.maxLength(50)]],
    active: [this.dataService.currentPlayer.active, [Validators.required, Validators.pattern('(?:true|false)')]]
  })


  constructor(public modalController: ModalController,
              public dataService: DataService,
              public toastController: ToastController,
              public http: HttpClient, public formBuilder: FormBuilder) {
  }


  async submitEditPlayer() {

    try {
      const call = this.http.put<Player>('/api/players/' + this.dataService.currentPlayer.playerId, this.editPlayerForm.value);
      const result = await firstValueFrom<Player>(call);
      let index = this.dataService.players.findIndex(b => b.playerId == this.dataService.currentPlayer.playerId)
      this.dataService.players[index] = result;
      this.dataService.currentPlayer = result;
      console.log('Data being sent in the request:', this.editPlayerForm.value);
      this.modalController.dismiss();
      const toast = await this.toastController.create({
        message: 'successfully updated',
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

  ngOnInit(): void {
    const currentPlayer = this.dataService.currentPlayer;


  }
}
