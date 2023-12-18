import {Component, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {firstValueFrom, Observable} from "rxjs";
import {CreateUserComponent} from "./create-user-component";
import {EditUserComponent} from "./edit-user.component";
import {UserService} from "../../services/user.service";
import {User} from "../models";
import {HttpClient} from "@angular/common/http";


@Component({
  template: `
      <ion-content style="--padding-top: 105px;">
          <ion-list>
              <ion-item *ngFor="let user of this.service.users| async">
                  <div style="display: grid; grid-template-columns: auto auto auto 1fr; gap: 10px; justify-content: center; width: fit-content; margin: auto;">
                      <ion-label class="ion-text-wrap" style="width: 200px;">
                          <h2>{{user.fullName}}</h2>
                      </ion-label>
                      <ion-label class="ion-text-wrap" style="width: 200px;">
                          <p>Email: {{user.email}}</p>
                      </ion-label>
                      <ion-label class="ion-text-wrap" style="width: 50px;">
                          <p>{{user.isAdmin ? 'Admin' : 'User'}}</p>
                      </ion-label>
                      <ion-button fill="clear" style="justify-self: end;" (click)="openModalEditUser(user.id)">Edit User</ion-button>
                  </div>
              </ion-item>
          </ion-list>
          <ion-footer>
              <ion-toolbar>
                  <ion-button slot="end" class="createUserButton" (click)="openModalCreateUser()">Create User</ion-button>
              </ion-toolbar>
          </ion-footer>
      </ion-content>
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
