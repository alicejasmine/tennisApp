import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DataService} from "../data.service";
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {MatchWithPlayers} from "../models";
import {ShotService} from "src/services/shot.service";
import { MatchService } from "src/services/match.service";

@Component({
    template: `
        <ion-content>
            <ion-list>
                <ion-item>

                    <ion-textarea
                            [formControl]="editMatchForm.controls.notes"
                            type="text"
                            label="Notes"
                            labelPlacement="floating"
                            [counter]="true"
                            maxlength="251"

                    ></ion-textarea>


                </ion-item>
            </ion-list>
            <ion-button data-testid="submit" [disabled]="editMatchForm.invalid" (click)="endMatch()">End Match
            </ion-button>
            <ion-button (click)="modalController.dismiss()">Close</ion-button>
        </ion-content>
    `,
    styleUrl: './edit-ending-match.component.scss'
})

export class EditEndingMatchComponent {

    constructor(public fb: FormBuilder, public modalController: ModalController, public http: HttpClient, public dataService: DataService, public toastController: ToastController, public router: Router, public shotService: ShotService, public matchService:MatchService) {

    }

    editMatchForm = this.fb.group({
        date: [this.dataService.currentMatch.date, [Validators.required]],
        startTime: [this.dataService.currentMatch.startTime],
        environment: [this.dataService.currentMatch.environment, [Validators.required, Validators.pattern('(?:indoor|outdoor)')]],
        surface: [this.dataService.currentMatch.surface, [Validators.required, Validators.pattern('(?:clay|hard|other)')]],
        playerid1: [this.dataService.currentMatch.playerId1, [Validators.required]],
        playerid2: [this.dataService.currentMatch.playerId2, [Validators.required]],
        fullnamePlayer1: [this.dataService.currentMatch.fullNamePlayer1],
        fullnamePlayer2: [this.dataService.currentMatch.fullNamePlayer2],
        notes: [this.dataService.currentMatch.notes],
        endtime: [this.dataService.currentMatch.endTime],
        finished: [this.dataService.currentMatch.finished]
    });



     endMatch() {
        this.matchService.editMatch(this.editMatchForm);
        this.shotService.registerShot();
        this.router.navigate(['/tabs/match-info/' + this.dataService.currentMatch.id]);

    }

}
