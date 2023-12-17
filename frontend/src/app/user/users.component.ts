import {Component, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {firstValueFrom, Observable} from "rxjs";
import {CreateUserComponent} from "./create-user-component";
import {EditUserComponent} from "./edit-user.component";
import {UserService} from "./user.service";
import {User} from "../models";
import {HttpClient} from "@angular/common/http";


@Component({
  template: `
    <app-title title="Users"></app-title>
    <ion-content [fullscreen]="true" >
      <div>
        <ion-card *ngFor="let user of this.service.users| async">
            <ion-card-header>
                <ion-card-title>
                    {{user.fullName}}
                </ion-card-title>
            </ion-card-header>
            <ion-card-content>Email: {{user.email}}</ion-card-content>
              <ion-card-content> {{user.isAdmin ? 'Admin' : 'User'}}</ion-card-content>

            <ion-button fill="clear" (click)="openModalEditUser(user.id)">Edit User</ion-button>
        </ion-card>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-button slot="end" class="createUserButton" (click)="openModalCreateUser()">Create User</ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styleUrls: ['users.component.scss'],
})
export class UsersComponent implements OnInit{
  constructor(
    private modalController: ModalController,
    public service: UserService
  ) {
  }



  async openModalCreateUser(){
    const modal = await this.modalController.create({
      component: CreateUserComponent
    });
    modal.present();
  }

  async openModalEditUser(id: number | undefined) {
    if (id !== undefined) {
      const editUser$ = this.service.getUserById(id);
      if (editUser$) {
        this.service.editingUser = await firstValueFrom(editUser$);
        const modal = await this.modalController.create({
          component: EditUserComponent
        });
        modal.present();
      }
    }
  }

  ngOnInit() {
    this.service.getUsers();
  }

}
