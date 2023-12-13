import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {TokenService} from "../services/token.service";
import {ToastController} from "@ionic/angular";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly token: TokenService,
    private readonly toast: ToastController,
  ) {
  }

  // If for some reason a given user tries to access something that needs authorization
  // we will redirect them to the login screen if they are not logged in.
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const isAuthenticated = !!this.token.getToken();
    if (isAuthenticated) return true;
    (await this.toast.create({
      message: 'Login required!',
      color: 'danger', duration: 5000, position: "top"
    })).present();
    return this.router.parseUrl('/login');
  }
}
