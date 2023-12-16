import {Component, OnInit,OnDestroy} from '@angular/core';
import {finalize, Subscription} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpEventType} from "@angular/common/http";
import {UserService, UserUpdate} from "./user.service";
import {AccountService} from "../account/account.service";
import {modalController} from "@ionic/core";
import {ModalController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-user-edit',
  template:  `
    <ion-content *ngIf="!loading">
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
          <ion-progress-bar
                  *ngIf="uploading"
                  [value]="uploadProgress"
          ></ion-progress-bar>

          <ion-toolbar>
              <ion-button slot="end" *ngIf="form.valid && !uploading" (click)="submit()">
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

export class EditUserComponent implements OnInit, OnDestroy {

  private accountSubscription?: Subscription;

  isAdmin?: boolean;
  loading: boolean = true;
  uploading: boolean = false;
  uploadProgress: number | null = null;
  isLogged?: boolean;

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

  async ngOnInit() {
    this.accountSubscription = this.accountService.isLogged.subscribe(logged => {
      this.isLogged = logged;
      if (logged){
        this.accountService.getCurrentUser().subscribe(user => {
          this.isAdmin = user.isAdmin;
          if (this.service.editingUser?.id != null){
            this.form.patchValue(this.service.editingUser);
            this.loading = false;
          }
        });
      }
    });
    this.accountService.checkStatus();
  }

  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }


  async submit() {
    if (this.form.invalid) return;
    this.uploading = true;
    this.service
      .update(this.form.value as UserUpdate)
      .pipe(
        finalize(() => {
          this.uploading = false;
          this.uploadProgress = null;
        })
      )
      .subscribe( (event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(
            100 * (event.loaded / (event.total ?? 1))
          );
        } else if (event.type == HttpEventType.Response && event.body) {
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

