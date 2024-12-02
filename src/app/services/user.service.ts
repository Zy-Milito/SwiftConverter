import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IUser } from '../interfaces/user';
import { ICurrency } from '../interfaces/currency';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authService = inject(AuthService);
  users: IUser[] = [];
  favoriteCurrencies: ICurrency[] = [];

  constructor() {
    this.loadData();
  }

  async loadData() {
    this.getUsers();
    this.getFavorites();
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

  async getFavorites() {
    var userId = this.authService.user?.id;
    const res = await fetch(environment.API_URL + `user/${userId}/favorites`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: ICurrency[] = await res.json();
    this.favoriteCurrencies = resJson;
    console.log(this.favoriteCurrencies);
    return resJson;
  }

  async toggleFavorite(isoCode: string) {
    var userId = this.authService.user?.id;
    const res = await fetch(
      environment.API_URL + `user/${userId}/favorites/${isoCode}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      }
    );
    if (res.status !== 200) {
      console.error('Failed to add to favorites.');
    } else {
      console.log('Currency added to favorites.');
      this.loadData();
    }
  }
}
