import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  fullName: string | undefined;
  fillSearchBar: boolean | undefined;

  constructor(private router: Router, private route: ActivatedRoute) {
  }


  goToAllPlayers() {
    this.router.navigate(['/all-players']);
  }

  async handleInput($event: any) {
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.fullName = params['fullName'];
      this.fillSearchBar = params['fillSearchBar'] === 'true';
    });
  }
}