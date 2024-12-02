import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user';
import { ILogin, IResLogin } from '../interfaces/login';
import { environment } from '../../environments/environment.development';
import { IRegister } from '../interfaces/register';
import { IClaims } from '../interfaces/claims';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    var token = localStorage.getItem('authToken');
    if (token) {
      this.claims = this.decodeToken(token);
      this.fetchUserDetails(token);
    }
  }

  user: IUser | undefined;
  claims: IClaims | null = null;

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

    return await this.fetchUserDetails(resJson.token);
  }

  async fetchUserDetails(token: string): Promise<IUser | null> {
    const userDetailsRes = await fetch(
      environment.API_URL + 'user/validation',
      {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (userDetailsRes.status !== 200) return null;

    const userDetailsResJson = await userDetailsRes.json();

    this.user = userDetailsResJson;
    this.claims = this.decodeToken(token);
    return userDetailsResJson;
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
    this.user = undefined;
    this.claims = null;
  }

  decodeToken(token: string): IClaims {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return {
      sub: decodedToken.sub,
      isAdmin: decodedToken.isAdmin === 'True' ? true : false,
    };
  }
}
