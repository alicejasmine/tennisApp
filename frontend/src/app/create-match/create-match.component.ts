import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DataService} from "../data.service";
import {MatchWithPlayers, Players, ResponseDto} from "../../models";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";

@Component({
  templateUrl: './create-match.component.html',
  styleUrl: './create-match.component.scss'
})
export class CreateMatchComponent {

  constructor(public fb: FormBuilder, public modalController: ModalController, public http: HttpClient, public dataService: DataService, public toastController: ToastController) {
    this.getPlayers();
  }

  createNewMatchForm = this.fb.group({
    date: ['', [Validators.required]],
    startTime: [''],
    environment: ['', [Validators.required, Validators.pattern('(?:indoor|outdoor)')]],
    surface: ['', [Validators.required, Validators.pattern('(?:clay|hard|other)')]],
    playerid1: ['', [Validators.required]],
    playerid2: ['', [Validators.required]],
    notes: ['']
  })

  async getPlayers() {
    const call = this.http.get<Players[]>('/api/players?page=1&resultsPerPage=10');
    this.dataService.players = await firstValueFrom<Players[]>(call);
  }

  async submit() {
    try {

      const observable = this.http.post<MatchWithPlayers>('/api/matches', this.createNewMatchForm.getRawValue())

      const response = await firstValueFrom<MatchWithPlayers>(observable);

      this.dataService.matchesWithPlayers.push(response);


      const toast = await this.toastController.create({
        message: 'Match was created!',
        duration: 1233,
        color: "success"
      })
      toast.present();
      this.modalController.dismiss();
    } catch (e) {
      if(e instanceof HttpErrorResponse) {
        const toast = await this.toastController.create({
          message: e.error.messageToClient,
          color: "danger"
        });
        toast.present();
      }
    }
  }
}
