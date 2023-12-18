import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/AuthService";
import {Role} from "../models";


@Component({
  selector: 'app-tabs',
  template: `
      <ion-tabs>
          <ion-tab-bar slot="bottom">
              <ion-tab-button tab="home" routerLink="home">
                  <ion-label>Home</ion-label>
                  <ion-icon name="home-outline"></ion-icon>
              </ion-tab-button>

              <ion-tab-button tab="all-players" routerLink="all-players">
                  <ion-label>Players</ion-label>
                  <ion-icon name="people-outline"></ion-icon>
              </ion-tab-button>

              <!-- Users tab only shown if user is an admin -->
              <ion-tab-button *ngIf="isAdmin" tab="users" routerLink="users">
                  <ion-label>Users</ion-label>
                  <ion-icon name="person-outline"></ion-icon>
              </ion-tab-button>
          </ion-tab-bar>
      </ion-tabs>
  `,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {

  constructor(private authService: AuthService) { }

  get isAdmin() {
    return this.authService.hasRole(Role.Admin); // use authService to check if user is an admin
  }

  ngOnInit() {}
}
