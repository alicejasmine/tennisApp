import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DataService} from "../data.service";
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {MatchWithPlayers} from "../models";
import {ShotService} from "src/services/shot.service";

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

    constructor(public fb: FormBuilder, public modalController: ModalController, public http: HttpClient, public dataService: DataService, public toastController: ToastController, public router: Router, public shotService: ShotService) {

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


    async editMatch() {
        try {
            const call = this.http.put<MatchWithPlayers>('api/matches/' + this.dataService.currentMatch.id, this.editMatchForm.value);
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

    async endMatch() {
        this.editMatch();
        this.shotService.registerShot();
        this.router.navigate(['/match-info/' + this.dataService.currentMatch.id]);

    }

}
