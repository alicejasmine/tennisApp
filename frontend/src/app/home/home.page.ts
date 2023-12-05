import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `<ion-searchbar animated="true" placeholder="Search players" debounce="100"
                            (ionInput)=""></ion-searchbar>`,
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  constructor(private router: Router) {}


  goToAllPlayers() {
    this.router.navigate(['/all-players']);
  }
}
