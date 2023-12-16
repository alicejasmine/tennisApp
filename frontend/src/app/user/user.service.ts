import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Player, User} from "../models";
import { BehaviorSubject, Observable } from 'rxjs';

export interface Registration {
  fullName: string;
  email: String;
  password: string;
}

export interface UserUpdate {
  fullName: string;
  email: string;
  isAdmin: boolean;
}

@Injectable()
export class UserService {

  private _users: BehaviorSubject<User[]>;
  public readonly users: Observable<User[]>;

  public editingUser: User = {};


  constructor(private readonly http: HttpClient) {
    this._users = new BehaviorSubject<User[]>([]);
    this.users = this._users.asObservable();
  }

  getUsers() {
    this.http.get<User[]>('/api/users').subscribe(data => {
      this._users.next(data);
    });
  }

  getUserById(id: number) {
    return this.http.get<User>(`/api/users/${id}`);
  }

  register(value: Registration) {
    return this.http.post<any>('/api/users/register', value);
  }

  update(value: UserUpdate) {
    const formData = new FormData();
    Object.entries(value).forEach(([key, value]) =>
      formData.append(key, value)
    );
    return this.http.put<User>('/api/users/update/' + this.editingUser.id, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
