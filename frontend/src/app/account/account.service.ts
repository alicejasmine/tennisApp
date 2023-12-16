import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ReplaySubject} from "rxjs";
import {User} from "../models";



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


  private logged = new ReplaySubject<boolean>(1);
  isLogged = this.logged.asObservable();



  getCurrentUser() {
    return this.http.get<User>('/api/account/info');
  }


  login(value: Credentials) {
    return this.http.post<{ token: string }>('/api/account/login', value);
  }

  async setLogged(){
    this.getCurrentUser();
    this.logged.next(true);
  }


  checkStatus() {
    if (localStorage.getItem('token')) {
      this.logged.next(true);
    } else {
      this.logged.next(false);
    }
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
