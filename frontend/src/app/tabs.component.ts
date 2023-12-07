import { Component } from "@angular/core";

@Component({
  template: `
      <ion-tabs>
          <ion-tab-bar slot="bottom">
              <ion-tab-button tab="home">
                  <ion-icon name="home-outline"></ion-icon>
                  Home
              </ion-tab-button>
              <ion-tab-button tab="login">
                  <ion-icon name="login"></ion-icon>
                  Login
              </ion-tab-button>
            <ion-tab-button tab="account">
              <ion-icon name="person-outline"></ion-icon>
                  Account
            </ion-tab-button>
            <ion-tab-button tab="user">
              <ion-icon name="person-outline"></ion-icon>
              User
            </ion-tab-button>
          </ion-tab-bar>
      </ion-tabs>
  `
})
export class TabsComponent {}