import {Component, OnInit,OnDestroy} from '@angular/core';
import {finalize, Subscription} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpEventType} from "@angular/common/http";
import {UserService, UserUpdate} from "../../services/user.service";
import {AccountService} from "../../services/account.service";

import {ModalController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-user-edit',
  template:  `
    <ion-content>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-list class="field-list">
          <ion-item>
            <ion-input label="Name" formControlName="fullName"></ion-input>
          </ion-item>

          <ion-item>
            <ion-input label="Email" formControlName="email"></ion-input>
          </ion-item>

            <ion-item>
                <ion-checkbox justify="space-between" formControlName="isAdmin">Administrator</ion-checkbox>
            </ion-item>
        </ion-list>
          <ion-toolbar>
              <ion-button slot="end" *ngIf="form.valid" (click)="submit()">
                  Update
              </ion-button>
              <ion-button slot="end" (click)="modalController.dismiss()">Cancel</ion-button>
          </ion-toolbar>

      </form>
        <ng-template #loading>
            <ion-spinner></ion-spinner>
        </ng-template>
    </ion-content>
    <ion-item-divider *ngIf="loading">Loading...</ion-item-divider>
  `,
})

export class EditUserComponent implements OnInit{

  form = this.fb.group({
    fullName: [this.service.editingUser.fullName, Validators.required],
    email: [this.service.editingUser.email, Validators.required],
    isAdmin: [this.service.editingUser.isAdmin, [Validators.required, Validators.pattern('(?:true|false)')]]
  });


  constructor(
    private readonly fb: FormBuilder,
    private readonly service: UserService,
    private readonly accountService: AccountService,
    public toastController: ToastController,
    public modalController: ModalController
  ) {}

  // fetch the user to be edited and fill the form
  async ngOnInit() {
    if (this.service.editingUser?.id != null){
      this.form.patchValue(this.service.editingUser);

    }
  }

  // take the new values and attempt to submit. Rejecting the form if necessary
  // if the form is fine, call our service method.
  // close the modal and show a success toast.
  async submit() {
    if (this.form.invalid) return;

    this.service
      .update(this.form.value as UserUpdate)
      .subscribe( (event) => {
        if (event.type == HttpEventType.Response && event.body) {
          this.form.patchValue(event.body);
        }
      });

    this.modalController.dismiss();
    const toast = await this.toastController.create({
      message: 'successfully updated',
      duration: 1000,
      color: 'success',
      position: 'top'
    })
    toast.present();
  }


}

