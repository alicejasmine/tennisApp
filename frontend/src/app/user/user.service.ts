import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../models";

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
export class UserService {
  constructor(private readonly http: HttpClient) {
  }

  register(value: Registration) {
    return this.http.post<any>('/api/users/register', value);
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
