import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: IUser[] = [];

  constructor() {
    this.loadData();
  }

  async loadData() {
    this.getUsers();
  }

  async getUsers() {
    const res = await fetch(environment.API_URL + 'user', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: IUser[] = await res.json();
    this.users = resJson;
    return resJson;
  }

  async deleteUser(userId: number) {
    const res = await fetch(environment.API_URL + `user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) {
      console.error('User could not be removed.');
    } else {
      console.log('User removed.');
      this.loadData();
    }
  }
}
