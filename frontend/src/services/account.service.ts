import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ReplaySubject} from "rxjs";
import {User} from "../app/models";



export interface Credentials {
  email: string;
  password: string;
}

export interface Registration {
  fullName: string;
  email: String;
  password: string;
}

export interface AccountUpdate {
  fullName: string;
  email: string;
}

@Injectable()
export class AccountService {

  constructor(private readonly http: HttpClient) {
  }

  // get the currently logged in user
  getCurrentUser() {
    return this.http.get<User>('/api/account/info');
  }

  // login a user, we then process the token and the access boolean.
  login(value: Credentials) {
    return this.http.post<{ token: string, isAdmin: boolean }>('/api/account/login', value);
  }

  // this is the public registration for a new user.
  register(value: Registration) {
    return this.http.post<any>('/api/account/register', value);
  }

  // for updating your own account while logged in, we do not allow edits to the admin boolean here.
  update(value: AccountUpdate) {
    const formData = new FormData();
    Object.entries(value).forEach(([key, value]) =>
      formData.append(key, value)
    );
    return this.http.put<User>('/api/account/update', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
