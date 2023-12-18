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

  getCurrentUser() {
    return this.http.get<User>('/api/account/info');
  }

  login(value: Credentials) {
    return this.http.post<{ token: string, isAdmin: boolean }>('/api/account/login', value);
  }

  register(value: Registration) {
    return this.http.post<any>('/api/account/register', value);
  }

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
