import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { AccountService, AccountUpdate } from '../../services/account.service';
import { AuthService } from "../../services/AuthService";
import { Role } from "../models";

@Component({
  template: `
      <ion-content style="--padding-top: 105px;">
          <form [formGroup]="form" (ngSubmit)="submit()">
              <ion-list class="field-list">
                  <ion-item>
                      <ion-input label="Name" formControlName="fullName"></ion-input>
                  </ion-item>
                  <ion-item>
                      <ion-input label="Email" formControlName="email"></ion-input>
                  </ion-item>
                  <ion-item *appUserRole="[Role.Admin]">
                      <ion-label style="color:red; font-weight:bold;">Administrator</ion-label>
                  </ion-item>
              </ion-list>
              <ion-button *ngIf="form.valid" (click)="submit()">
                  Update
              </ion-button>
          </form>
      </ion-content>
  `,
  styleUrls: ['./form.css'],
})

export class AccountComponent implements OnDestroy {
  protected readonly Role = Role;
  private subscriptions: Subscription[] = [];

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AccountService,
    public readonly auth: AuthService
  ) {}

  ionViewWillEnter() {
    const user = this.service.getCurrentUser().subscribe(user => {
      this.form.patchValue(user);
    });
    this.subscriptions.push(user);

    // Reset form on logout
    // though it may not seem necessary we are still doing this to try and remove
    // any data left over.
    const clear = this.auth.isLoggedIn$.subscribe(() => {
      if (!this.auth.isLoggedIn$){
        this.form.reset();
      }
    });
    this.subscriptions.push(clear);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe all subscriptions
  }

  submit() {
    if (this.form.invalid) return;

    this.service
      .update(this.form.value as AccountUpdate)
      .subscribe((event) => {
        if (event.type == HttpEventType.Response && event.body) {
          this.form.patchValue(event.body);
        }
      });
  }
}
