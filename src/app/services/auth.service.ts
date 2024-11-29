import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user';
import { ILogin, IResLogin } from '../interfaces/login';
import { environment } from '../../environments/environment.development';
import { IRegister } from '../interfaces/register';
import { IClaims } from '../interfaces/claims';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    if(this.token){
      this.claims = this.decodeToken(this.token)
      this.getMe();
    }

  }

  user: IUser | undefined;
  token: string | null;
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
    this.token = resJson.token;

    return await this.getMe();
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
    this.token = '';
    this.user = undefined;
  }

  async getMe():Promise<IUser | null>{
    const userDetailsRes = await fetch(
      environment.API_URL + 'user/validation',
      {
        method: 'GET',
        headers: {
          Authorization: `${this.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (userDetailsRes.status !== 200) return null;

    const userDetailsResJson = await userDetailsRes.json();

    this.user = userDetailsResJson;
    return userDetailsResJson;
  }

  decodeToken(token:string):IClaims{
    const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const claimsBack = JSON.parse(jsonPayload);
      return {
        sub: claimsBack.sub,
        isAdmin: claimsBack.isAdmin === 'True' ? true : false
      }
  }

  

}


