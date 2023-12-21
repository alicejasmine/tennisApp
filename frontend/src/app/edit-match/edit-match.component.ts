import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DataService} from "../data.service";
import {Match, MatchWithPlayers} from "../models";
import {firstValueFrom} from "rxjs";
import { MatchService } from "src/services/match.service";

@Component({
  templateUrl: './edit-match.component.html',
  styleUrl: './edit-match.component.scss'
})

export class EditMatchComponent {
  constructor(public fb: FormBuilder, public modalController: ModalController, public http: HttpClient, public dataService: DataService, public toastController: ToastController, public matchService:MatchService) {

  }

  editMatchForm = this.fb.group({
    date: [this.dataService.currentMatch.date, [Validators.required]],
    startTime: [this.dataService.currentMatch.startTime],
    environment: [this.dataService.currentMatch.environment, [Validators.required, Validators.pattern('(?:indoor|outdoor)')]],
    surface: [this.dataService.currentMatch.surface, [Validators.required, Validators.pattern('(?:clay|hard|other)')]],
    playerid1: [this.dataService.currentMatch.playerId1, [Validators.required]],
    playerid2: [this.dataService.currentMatch.playerId2, [Validators.required]],
    notes: [this.dataService.currentMatch.notes]
  });


   editMatch(){
    this.matchService.editMatch(this.editMatchForm)
  }
}
