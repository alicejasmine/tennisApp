import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Player, User} from "../app/models";
import {BehaviorSubject, Observable, tap} from 'rxjs';

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

  // fetch and turn our users into an obs list
  // called after creating or editing a user to refresh our list.
  getUsers() {
    this.http.get<User[]>('/api/users').subscribe(data => {
      this._users.next(data);
    });
  }

  // get a user by id, most likely to edit them as Admin.
  getUserById(id: number) {
    return this.http.get<User>(`/api/users/${id}`);
  }
  // create a new account as Admin, allows giving Admin access.
  register(value: Registration) {
    return this.http.post<any>('/api/users/register', value).pipe(
      tap(_ => {
        this.getUsers();
      })
    );
  }

  // Update another account as admin, allows giving a user made account admin access.
  update(value: UserUpdate) {
    const formData = new FormData();
    Object.entries(value).forEach(([key, value]) =>
      formData.append(key, value)
    );
    return this.http.put<User>('/api/users/update/' + this.editingUser.id, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap(_ => {
        this.getUsers();
      })
    );
  }
}
