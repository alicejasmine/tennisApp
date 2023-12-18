import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import { AccountService, AccountUpdate } from '../../services/account.service';
import {finalize, firstValueFrom, Subscription} from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import {UsersComponent} from "../user/users.component";
import {AuthService} from "../../services/AuthService";
import {Role} from "../models";
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


          <ion-item *ngIf="this.auth.hasRole(Role.Admin)">
              <ion-label style="color:red; font-weight:bold;">Administrator</ion-label>
          </ion-item>
        </ion-list>
        <ion-button *ngIf="form.valid" (click)="submit()">
          Update
        </ion-button>
      </form>
      <ng-template #loading>
        <ion-spinner></ion-spinner>
      </ng-template>
    </ion-content>

  `,
  styleUrls: ['./form.css'],
})

export class AccountComponent implements OnInit{
  protected readonly Role = Role;


  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', Validators.required],
  });


  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AccountService,
    public readonly auth: AuthService
  ) {}

  async ngOnInit() {
    this.service.getCurrentUser().subscribe(user => {
      this.form.patchValue(user);
      this.isAdmin = user.isAdmin;
    });

    this.service.checkStatus();
  }
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
