import {ActivatedRouteSnapshot, CanActivate, Route, Router} from "@angular/router";
import {Injectable} from "@angular/core";
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
    if (!this.authService.isAuthorized()) { // if the user is not authorized, send them home
      this.router.navigate(['tabs/home']);
      return false;
    }

    const roles = route.data['roles'] as Role[];

    if (roles && !roles.some(r => this.authService.hasRole(r))) { // if the user is not admin, send them home
      this.router.navigate(['tabs/home']);
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
