import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ToastController } from "@ionic/angular";
import { Observable } from "rxjs";
import { User } from "src/models";
import { TokenService } from "src/services/token.service";

@Component({
  template: `
    <app-title title="Users"></app-title>
    <ion-content [fullscreen]="true">
      <ion-list [inset]="true">
        <ion-item [id]="'card_'+user.id" *ngFor="let user of users$ | async">
          <ion-label>
            <h2>{{user.fullName}}</h2>
            <p>Email: {{user.email}}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$?: Observable<User[]>;

  constructor(
    private http: HttpClient
  ) {

  }
  async fetchUsers() {
    this.users$ = this.http.get<User[]>('/api/users');
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

}
