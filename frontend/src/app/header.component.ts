import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {TokenService} from "src/services/token.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-title',
  template: `
      <ion-header>
          <ion-toolbar>
              
            <ion-col size="2" class="logo">
              <img src="assets/img/stepwise-logo.JPG" height="100" width="200" alt="logo">
            </ion-col>
              <ion-buttons slot="end">
                <ng-container *ngIf="token.getToken(); else notLoggedIn" >
                  <ion-button fill="outline" [routerLink]="'/account'">
                    My Account
                  </ion-button>
                  <ion-button fill="solid"  (click)="token.clearToken()" [routerLink]="'/home'" >
                    Logout
                    <ion-icon slot="end" name="log-out"></ion-icon>
                  </ion-button>
                </ng-container>
                  <ng-template #notLoggedIn>
                      <ion-button fill="outline" [routerLink]="'/login'">
                          Login
                          <ion-icon slot="end" name="log-in"></ion-icon>
                      </ion-button>
                      <ion-button fill="solid" [routerLink]="'/register'">
                          Register
                      </ion-button>
                  </ng-template>
              </ion-buttons>
          </ion-toolbar>
      </ion-header>
  `
})
export class HeaderComponent implements OnChanges {
  @Input("title") titleText?: string;

  constructor(
    readonly token: TokenService,
    private readonly title: Title,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.title.setTitle(`Stepwise - ${this.titleText}`)
  }

  protected readonly RouterLink = RouterLink;
}
