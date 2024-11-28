import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: IUser[] = [];

  constructor() {}

  async getUsers() {
    const res = await fetch(environment.API_URL + 'user', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: IUser[] = await res.json();
    this.users = resJson;
  }
}
