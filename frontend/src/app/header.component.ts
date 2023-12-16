import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {TokenService} from "src/services/token.service";

@Component({
  selector: 'app-title',
  template: `
      <ion-header>
          <ion-toolbar>

            <ion-col size="2" class="logo">
              <img src="assets/img/Stepwise.svg" height="100" width="200" alt="logo">
            </ion-col>
              <ion-buttons slot="end">
                  <ion-button fill="solid" *ngIf="token.getToken(); else notLoggedIn" (click)="token.clearToken()">
                      Logout
                      <ion-icon slot="end" name="log-out"></ion-icon>
                  </ion-button>
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
}
