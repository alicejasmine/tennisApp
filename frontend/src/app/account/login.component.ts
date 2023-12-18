import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {AccountService, Credentials} from "../../services/account.service";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {catchError, of, tap} from "rxjs";
import {AuthService} from "../../services/AuthService";
import {TokenService} from "../../services/token.service";


@Component({
  template: `
      <ion-content style="--padding-top: 105px;">
          <form [formGroup]="form" (ngSubmit)="submit()">
              <ion-list>

                  <ion-item>
                      <ion-input formControlName="email" data-testid="emailInput" placeholder="name@company.com"
                                 label-placement="floating">
                          <div slot="label">Email
                              <ion-text *ngIf="email.touched && email.invalid"
                                        color="danger">Valid
                                  email is required
                              </ion-text>
                          </div>
                      </ion-input>
                  </ion-item>

                  <ion-item>
                      <ion-input type="password" formControlName="password" data-testid="passwordInput"
                                 placeholder="****************" label-placement="floating">
                          <div slot="label">Password
                              <ion-text
                                      *ngIf="password.touched && password.errors?.['required']"
                                      color="danger">
                                  Required
                              </ion-text>
                          </div>
                      </ion-input>
                  </ion-item>

              </ion-list>

              <ion-button id="btn-submit" type="submit" [disabled]="form.invalid" (click)="submit()">Submit</ion-button>


          </form>
      </ion-content>
  `,
  styleUrls: ['./form.css'],
})

export class LoginComponent {



  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AccountService,
    private readonly router: Router,
    private readonly toast: ToastController,
    private authService: AuthService,
    private token: TokenService
  ) { }

  async submit() {
    if (this.form.invalid) return;

    this.service.login(this.form.value as Credentials).pipe(
      tap(async response => {
        this.authService.handleLoginResponse(response.isAdmin);
        this.token.setToken(response.token)
        this.router.navigateByUrl('/home');

        const toast = await this.toast.create({
          message: 'Login Successful!',
          color: 'success',
          duration: 2000
        });
        toast.present();
      }),
      catchError(async error => {
        console.error("An error occurred during login: ", error);

        const toast = await this.toast.create({
          message: 'Login Failed...',
          color: 'danger',
          duration: 2000
        });
        toast.present();

        return of(); // Return an empty observable on error
      })
    ).subscribe();
  }
}
