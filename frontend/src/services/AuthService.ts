import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role } from "../app/models";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = window.sessionStorage;
  isLoggedIn$ = new BehaviorSubject<boolean>(this.isAuthorized());

  isAuthorized(): boolean {
    return !!this.storage.getItem("token");
  }

  hasRole(role: Role): boolean {
    const userRole = this.storage.getItem('role');
    return userRole === role;
  }

  handleLoginResponse(isAdmin: boolean) {
    if (isAdmin) {
      this.storage.setItem('role', Role.Admin);
    } else {
      this.storage.setItem('role', Role.User);
    }
    this.isLoggedIn$.next(true);
  }

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
