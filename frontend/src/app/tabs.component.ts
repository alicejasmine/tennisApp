import {Component, OnInit, OnDestroy} from "@angular/core";
import {Subscription} from 'rxjs';
import {AccountService} from "./account/account.service";

@Component({
  template: `
      <ion-tabs>
          <ion-tab-bar slot="bottom">
              <ion-tab-button tab="home">
                  <ion-icon name="home-outline"></ion-icon>
                  Home
              </ion-tab-button>
              <ion-tab-button tab="all-players">
                  <ion-icon name="person-outline"></ion-icon>
                  Players
              </ion-tab-button>
            <ion-tab-button tab="users" *ngIf="isLoggedInAndAdmin()">
              <ion-icon name="person-outline"></ion-icon>
              Users
            </ion-tab-button>
          </ion-tab-bar>
      </ion-tabs>
  `
})
export class TabsComponent implements OnInit, OnDestroy {

  isAdmin?: boolean;
  isLogged?: boolean;
  loading?: boolean = true;
  private accountSubscription?: Subscription;

  constructor(private readonly service: AccountService) {}

  async ngOnInit() {

    this.accountSubscription = this.service.isLogged.subscribe(logged => {
      this.isLogged = logged;
      if (logged){
      this.service.getCurrentUser().subscribe(user => {
        this.isAdmin = user.isAdmin;
        this.loading = false;
        });
      }

    });
    this.service.checkStatus();
  }

  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }

  isLoggedInAndAdmin(): boolean {
    return this.isAdmin === true && !this.loading;
  }
}
