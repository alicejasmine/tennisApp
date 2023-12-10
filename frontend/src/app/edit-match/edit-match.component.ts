import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DataService} from "../data.service";
import {Match} from "../models";
import {firstValueFrom} from "rxjs";

@Component({
  templateUrl: './edit-match.component.html',
  styleUrl: './edit-match.component.scss'
})

export class EditMatchComponent {
  constructor(public fb: FormBuilder, public modalController: ModalController, public http: HttpClient, public dataService: DataService, public toastController: ToastController) {

  }

  editMatchForm = this.fb.group({
    date: [this.dataService.currentMatch.date, [Validators.required]],
    startTime: [this.dataService.currentMatch.startTime],
    environment: [this.dataService.currentMatch.environment, [Validators.required, Validators.pattern('(?:indoor|outdoor)')]],
    surface: [this.dataService.currentMatch.surface, [Validators.required, Validators.pattern('(?:clay|hard|other)')]],
    notes: [this.dataService.currentMatch.notes]
  });

  async editMatch() {
    try {
      const call = this.http.put<Match>('api/matches/' + this.dataService.currentMatch.id, this.editMatchForm.value);
      const result = await firstValueFrom<Match>(call);
      let index = this.dataService.matches.findIndex(m => m.id == this.dataService.currentMatch.id)
      this.dataService.matches[index] = result;
      this.dataService.currentMatch = result;
      this.modalController.dismiss();
      const toast = await this.toastController.create({
        message: 'Match is updated',
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
