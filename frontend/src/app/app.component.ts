import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/AuthService";
import {Role} from "./models";
import {TokenService} from "../services/token.service";
import {Title} from "@angular/platform-browser";

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
                  <ion-button fill="outline" *ngIf="isAuthorized" routerLink="account">
                      <ion-label>Profile</ion-label>
                  </ion-button>

                  <ion-button fill="solid" *ngIf="isAuthorized" (click)="logout()">
                      <ion-label>Logout</ion-label>
                      <ion-icon slot="end" name="log-out"></ion-icon>
                  </ion-button>

                  <!-- Anonymous only -->
                  <ion-button fill="outline" *ngIf="!isAuthorized" routerLink="login">
                      <ion-label>Login</ion-label>
                      <ion-icon slot="end" name="log-in"></ion-icon>
                  </ion-button>
                  <ion-button fill="solid" *ngIf="!isAuthorized" routerLink="register">
                      Register
                  </ion-button>
              </ion-buttons>
          </ion-toolbar>
      </ion-header>

      <div>
      <ion-content fullscreen> <!-- Without this padding our content will show under the header -->
          <ion-router-outlet></ion-router-outlet>
      </ion-content>
      </div>
      <app-tabs></app-tabs>
  `,
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  constructor(private router: Router, private authService: AuthService, private token: TokenService, private readonly title: Title) { }

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
    await this.router.navigate(['/home']);
  }
}
