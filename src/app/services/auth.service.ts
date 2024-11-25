import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user';
import { ILogin, IResLogin } from '../interfaces/login';
import { environment } from '../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IRegister } from '../interfaces/register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    const helper = new JwtHelperService();
    const token = this.getToken();

    if (!token) return;

    const decodedToken = helper.decodeToken(token);

    if (token) {
      if (!this.user)
        this.user = {
          username: decodedToken.username,
          token: token,
          isAdmin: decodedToken.isAdmin ? true : false,
        };
      else this.user!.token = token;
    }
  }

  user: IUser | undefined;

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

    this.user = {
      username: loginData.username,
      token: resJson.token,
      isAdmin: false,
    };

    localStorage.setItem('authToken', resJson.token);

    const userDetailsRes = await fetch(
      environment.API_URL + `user/${encodeURIComponent(loginData.username)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${resJson.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (userDetailsRes.status !== 200) return;

    const userDetailsResJson = await userDetailsRes.json();

    this.user.isAdmin = userDetailsResJson.isAdmin;

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
    this.user = {
      username: '',
      token: '',
      isAdmin: false,
    };
  }
}
