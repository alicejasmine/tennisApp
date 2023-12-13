import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {ModalController, ToastController} from "@ionic/angular";
import { Observable } from "rxjs";
import { TokenService } from "src/services/token.service";
import {User} from "../models";
import {CreateUserComponent} from "./create-user-component";

@Component({
  template: `
    <app-title title="Users"></app-title>
    <ion-content [fullscreen]="true">


      <ion-list [inset]="true">
        <ion-item [id]="'card_'+user.id" *ngFor="let user of users$ | async">
          <ion-label>
            <h2>{{user.fullName}}</h2>
            <p>Email: {{user.email}}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-button slot="end" class="createUserButton" (click)="openModalCreateUser()">Create User</ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styleUrls: ['users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$?: Observable<User[]>;

  constructor(
    private http: HttpClient,
    public modalController: ModalController
  ) {
  }

  async openModalCreateUser(){
    const modal = await this.modalController.create({
      component: CreateUserComponent
    });
    modal.present();
  }

  async fetchUsers() {
    this.users$ = this.http.get<User[]>('/api/users');
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

}
