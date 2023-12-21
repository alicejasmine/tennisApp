import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/AuthService";
import {Role} from "./models";
import {Title} from "@angular/platform-browser";
import { ModalController } from '@ionic/angular';
import { LoginComponent } from './account/login.component';
import { RegisterComponent } from './account/register.component';
import { AccountComponent } from './account/account.component';

@Component({
  selector: 'app-root',
  template: `
      <ion-header>
          <ion-toolbar>
              <ion-col size="2" class="logo">
                  <img src="assets/img/stepwise-logo.JPG" height="100" width="200" alt="logo">
              </ion-col>
              <ion-buttons slot="end">
                  <!-- Authorized only -->
                  <ion-button fill="outline" *ngIf="isAuthorized" (click)="openProfileModal()">
                      <ion-label>Profile</ion-label>
                  </ion-button>

                  <ion-button fill="solid" *ngIf="isAuthorized" (click)="logout()">
                      <ion-label>Logout</ion-label>
                      <ion-icon slot="end" name="log-out"></ion-icon>
                  </ion-button>

                  <!-- Anonymous only -->
                  <ion-button fill="outline" *ngIf="!isAuthorized" (click)="openLoginModal()">
                      <ion-label>Login</ion-label>
                      <ion-icon slot="end" name="log-in"></ion-icon>
                  </ion-button>

                  <ion-button fill="solid" *ngIf="!isAuthorized" (click)="openRegisterModal()">
                      Register
                  </ion-button>
              </ion-buttons>
          </ion-toolbar>
      </ion-header>


      <ion-content>
          <ion-router-outlet></ion-router-outlet>
      </ion-content>
  `,
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  constructor(
    private authService: AuthService,
    private title: Title,
    private modalController: ModalController
  ) { }

  // We use app.component for our header and its functions, such as logging in, out, or registering.
  get isAuthorized() {
    return this.authService.isAuthorized();
  }

  get isAdmin() {
    return this.authService.hasRole(Role.Admin);
  }

  ngOnInit() {
    this.title.setTitle(`Stepwise`)
  }

  async logout() {
    await this.authService.logout();
  }

  // Functions to open login, register & profile as modals
  async openLoginModal() {
    const modal = await this.modalController.create({
      component: LoginComponent,
      cssClass: 'modal-css'
    });
    modal.present();
  }

  async openRegisterModal() {
    const modal = await this.modalController.create({
      component: RegisterComponent,
      cssClass: 'modal-css'
    });
    modal.present();
  }

  async openProfileModal() {
    const modal = await this.modalController.create({
      component: AccountComponent,
      cssClass: 'modal-css'
    });
    modal.present();
  }
}
