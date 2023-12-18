import {Injectable} from '@angular/core';
import {Role} from "../app/models";
import {HttpClient} from "@angular/common/http";


@Injectable()
export class AuthService {
  private readonly storage: Storage = window.sessionStorage;

  constructor() {
  }
  isAuthorized() {
    return !!this.storage.getItem("token");
  }

  hasRole(role: Role): boolean {
    const userRole = this.storage.getItem('role');
    return userRole === role;
  }

  handleLoginResponse(isAdmin: boolean) {
    if (isAdmin) {
      this.storage.setItem('role', 'Admin')
    } else {
      this.storage.setItem('role', 'User')
    }
  }

  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        // Clear client-side storage
        this.storage.removeItem('token');
        this.storage.removeItem('role');
        resolve();
      } catch(err) {
        // If an error occurs while trying to remove items from storage
        console.error(err);
        alert("An error occurred during logout. Please try again.");
        reject(err);
      }
    });
  }

}
