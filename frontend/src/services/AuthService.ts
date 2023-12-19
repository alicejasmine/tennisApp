import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role } from "../app/models";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = window.sessionStorage;
  isLoggedIn$ = new BehaviorSubject<boolean>(this.isAuthorized());

  // same effect as the token service get token method, should be refactored out.
  isAuthorized(): boolean {
    return !!this.storage.getItem("token");
  }

  // check if we have the given role, our use cases are typically only checking if they are admin
  hasRole(role: Role): boolean {
    const userRole = this.storage.getItem('role');
    return userRole === role;
  }

  // process the isAdmin boolean of the logged-in user and set a role.
  handleLoginResponse(isAdmin: boolean) {
    if (isAdmin) {
      this.storage.setItem('role', Role.Admin);
    } else {
      this.storage.setItem('role', Role.User);
    }
    this.isLoggedIn$.next(true);
  }

  // log out the user
  // clear the token, clear the role, set logged in to false, throw an error if there is a problem.
  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.storage.removeItem('token');
        this.storage.removeItem('role');
        this.isLoggedIn$.next(false);
        resolve();
      } catch (err) {
        console.error(err);
        alert("An error occurred during logout. Please try again.");
        reject(err);
      }
    });
  }
}
