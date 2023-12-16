import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {AccountService, Credentials} from "./account.service";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {TokenService} from "../../services/token.service";
import {firstValueFrom} from "rxjs";


@Component({
  template: `
    <app-title title="Login"></app-title>
      <ion-content>
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
    private readonly token: TokenService
  ) { }

  async submit() {
    if (this.form.invalid) return;
    const { token } = await firstValueFrom(this.service.login(this.form.value as Credentials));
    this.token.setToken(token);

    await this.service.setLogged();

    this.router.navigateByUrl('/home');

    (await this.toast.create({
      message: "Welcome back!",
      color: "success",
      duration: 5000,
      position: "top"
    })).present();
  }
}
