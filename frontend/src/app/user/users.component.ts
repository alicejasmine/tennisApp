import {Component, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {firstValueFrom, Observable} from "rxjs";
import {CreateUserComponent} from "./create-user-component";
import {EditUserComponent} from "./edit-user.component";
import {UserService} from "../../services/user.service";
import {Role, User} from "../models";
import {AuthService} from "../../services/AuthService";


@Component({
  template: `
      <ion-content style="--padding-top: 105px;">
          <ion-list>
              <ion-item *ngFor="let user of this.users$ | async">
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
                  <ion-button *ngIf="this.authService.hasRole(Role.Admin)" slot="end" class="createUserButton" (click)="openModalCreateUser()">Create User</ion-button>
              </ion-toolbar>
          </ion-footer>
      </ion-content>
  `,
  styleUrls: ['users.component.scss'],
})
export class UsersComponent implements OnInit{
  users$: Observable<User[]>;
  protected readonly Role = Role;
  constructor(
    private modalController: ModalController,
    public service: UserService,
    public authService: AuthService
  ) {
    this.users$ = service.users; // fill our obs list
  }


  // fetch users from service
  ngOnInit() {
    this.service.getUsers();
  }


  // These methods open our modals
  async openModalCreateUser(){
    const modal = await this.modalController.create({
      component: CreateUserComponent,
      cssClass: 'modal-css'
    });
    modal.present();
  }

  async openModalEditUser(id: number | undefined) {
    if (id !== undefined) {
      const editUser$ = this.service.getUserById(id);
      if (editUser$) {
        this.service.editingUser = await firstValueFrom(editUser$);
        const modal = await this.modalController.create({
          component: EditUserComponent,
          cssClass: 'modal-css'
        });
        modal.present();
      }
    }
  }

}
