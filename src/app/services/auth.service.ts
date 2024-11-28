import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/user';
import { ILogin, IResLogin } from '../interfaces/login';
import { environment } from '../../environments/environment.development';
import { IRegister } from '../interfaces/register';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userService = inject(UserService);

  constructor() {
    this.token = localStorage.getItem('authToken');
    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails) {
      this.user = JSON.parse(userDetails) as IUser;
    }
  }

  user: IUser | undefined;
  token: string | null;

  async login(loginData: ILogin) {
    const res = await fetch(environment.API_URL + 'authentication/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (res.status !== 200) return;

    const resJson: IResLogin = await res.json();

    if (!resJson.token) return;

    localStorage.setItem('authToken', resJson.token);
    this.token = resJson.token;

    const userDetailsRes = await fetch(
      environment.API_URL + 'user/validation',
      {
        method: 'GET',
        headers: {
          Authorization: `${resJson.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (userDetailsRes.status !== 200) return;

    const userDetailsResJson = await userDetailsRes.json();

    this.user = userDetailsResJson;
    sessionStorage.setItem('userDetails', JSON.stringify(userDetailsResJson));

    return userDetailsRes;
  }

  async register(regData: IRegister) {
    const res = await fetch(environment.API_URL + 'user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(regData),
    });

    if (res.status != 201) return;
    return res;
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  clearToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userDetails');
    this.token = '';
    this.user = undefined;
  }
}
