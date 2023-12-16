import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import { AccountService, AccountUpdate } from './account.service';
import {finalize, firstValueFrom, Subscription} from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import {UsersComponent} from "../user/users.component";
@Component({
  template: `
    <app-title title="Account"></app-title>
    <ion-content *ngIf="!loading">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-list class="field-list">
          <ion-item>
            <ion-input label="Name" formControlName="fullName"></ion-input>
          </ion-item>

          <ion-item>
            <ion-input label="Email" formControlName="email"></ion-input>
          </ion-item>


          <ion-item *ngIf="isAdmin">
            <ion-toggle  disabled [checked]="isAdmin">Administrator</ion-toggle>
          </ion-item>
        </ion-list>
        <ion-progress-bar
          *ngIf="uploading"
          [value]="uploadProgress"
        ></ion-progress-bar>
        <ion-button *ngIf="form.valid && !uploading" (click)="submit()">
          Update
        </ion-button>
      </form>
      <ng-template #loading>
        <ion-spinner></ion-spinner>
      </ng-template>
    </ion-content>
    <ion-item-divider *ngIf="loading">Loading...</ion-item-divider>
  `,
  styleUrls: ['./form.css'],
})

export class AccountComponent implements OnInit {

  private accountSubscription?: Subscription;

  isAdmin?: boolean;
  loading: boolean = true;
  uploading: boolean = false;
  uploadProgress: number | null = null;
  isLogged?: boolean;

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', Validators.required],
  });


  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AccountService
  ) {}

  async ngOnInit() {
    this.accountSubscription = this.service.isLogged.subscribe(logged => {
      this.isLogged = logged;
      if (logged){
        this.service.getCurrentUser().subscribe(user => {
          this.form.patchValue(user);
          this.isAdmin = user.isAdmin;
          this.loading = false;
        });
      }

    });
    this.service.checkStatus();
  }



  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }


  submit() {
    if (this.form.invalid) return;
    this.uploading = true;
    this.service
      .update(this.form.value as AccountUpdate)
      .pipe(
        finalize(() => {
          this.uploading = false;
          this.uploadProgress = null;
        })
      )
      .subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(
            100 * (event.loaded / (event.total ?? 1))
          );
        } else if (event.type == HttpEventType.Response && event.body) {
          this.form.patchValue(event.body);
        }
      });
  }
}
