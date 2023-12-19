import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {CustomValidators} from "../custom-validators";
import {AccountService, Registration} from "../../services/account.service";
import {ModalController, ToastController} from "@ionic/angular";
import {firstValueFrom} from "rxjs";

@Component({
  template: `

    <ion-content style="--padding-top: 105px;">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-list>

          <ion-item>
            <ion-input formControlName="fullName" data-testid="fullNameInput" placeholder="Your full name"
                       label-placement="floating">
              <div slot="label">Name
                <ion-text *ngIf="fullName.touched && fullName.invalid" color="danger">
                  Required
                </ion-text>
              </div>
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-input formControlName="email" data-testid="emailInput" placeholder="Email (also used for login)"
                       label-placement="floating">
              <div slot="label">Email
                <ion-text *ngIf="email.touched && email.invalid" color="danger">Valid
                  email is required
                </ion-text>
              </div>
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-input type="password" formControlName="password" data-testid="passwordInput"
                       placeholder="Type a hard to guess password" label-placement="floating">
              <div slot="label">Password
                <ion-text *ngIf="password.touched && password.errors?.['required']" color="danger">
                  Required
                </ion-text>
                <ion-text *ngIf="password.touched && password.errors?.['minlength']" color="danger">
                  Too short
                </ion-text>
              </div>
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-input type="password" formControlName="passwordRepeat" data-testid="passwordRepeatInput"
                       placeholder="Repeat your password to make sure it was typed correct" label-placement="floating">
              <div slot="label">Password (again)
                <ion-text *ngIf="passwordRepeat.touched && passwordRepeat.errors?.['matchOther']" color="danger">
                  Must match the password
                </ion-text>
              </div>
            </ion-input>
          </ion-item>

        </ion-list>

        <ion-button id="btn-submit" [disabled]="form.invalid" (click)="submit()">Submit</ion-button>
      </form>
    </ion-content>
  `,
  styleUrls: ['./form.css'],
})
export class RegisterComponent {
  readonly form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordRepeat: ['', [Validators.required, CustomValidators.matchOther('password')]]
  });

  get fullName() { return this.form.controls.fullName; }
  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password }
  get passwordRepeat() { return this.form.controls.passwordRepeat }


  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AccountService,
    private readonly toast: ToastController,
    private modalController: ModalController
  ) {
  }


  // This method is how new anonymous users can create an account
  // check the form, if its valid call the method in our service and show a toast.
  async submit() {
    try {
      if (this.form.invalid) {
        // Handle form validation error
        return;
      }

      // Call the register service method
      await firstValueFrom(this.service.register(this.form.value as Registration));

      // Display success message
      (await this.toast.create({
        message: "Thank you for signing up!",
        color: "success",
        duration: 5000,
        position: "top"
      })).present();

      this.modalController.dismiss(); // Close the modal
    } catch (error) { // generic error catch
      console.error("Registration failed:", error);

      // Display an error message to the user
      (await this.toast.create({
        message: "Registration failed.",
        color: "danger",
        duration: 5000,
        position: "top"
      })).present();
    }
  }
}
