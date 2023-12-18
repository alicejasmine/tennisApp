import {ActivatedRouteSnapshot, CanActivate, Route, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {TokenService} from "../services/token.service";
import {ToastController} from "@ionic/angular";
import {AuthService} from "../services/AuthService";
import {Observable} from "rxjs";
import {Role} from "./models";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthorized()) {
      console.log("not auth")
      this.router.navigate(['/login']);
      return false;
    }
    const roles = route.data["roles"] as Role[];
    if (roles && !roles.some(r => this.authService.hasRole(r))) {
      this.router.navigate(['error', 'not-found']);
      return false;
    }
    return true;
  }
  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthorized()) {
      return false;
    }
    const roles = route.data && route.data["roles"] as Role[];
    if (roles && !roles.some(r => this.authService.hasRole(r))) {
      return false;
    }
    return true;
  }
}
