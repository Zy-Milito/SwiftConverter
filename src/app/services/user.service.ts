import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IUser } from '../interfaces/user';
import { ICurrency } from '../interfaces/currency';
import { AuthService } from './auth.service';
import { IHistory } from '../interfaces/history';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authService = inject(AuthService);

  private usersSubject: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>(
    []
  );
  public users$ = this.usersSubject.asObservable();

  public favoriteCurrenciesSubject: BehaviorSubject<ICurrency[]> =
    new BehaviorSubject<ICurrency[]>([]);
  public favoriteCurrencies$ = this.favoriteCurrenciesSubject.asObservable();

  private historySubject: BehaviorSubject<IHistory[]> = new BehaviorSubject<
    IHistory[]
  >([]);
  public history$ = this.historySubject.asObservable();

  constructor() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.loadData(user.id);
      }
    });
  }

  async loadData(userId: number) {
    await Promise.all([
      this.getUsers(),
      this.getFavorites(userId),
      this.getUserHistory(userId),
    ]);
  }

  async getUsers() {
    const res = await fetch(environment.API_URL + 'user', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: IUser[] = await res.json();
    this.usersSubject.next(resJson);
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
      Swal.fire({
        icon: 'error',
        title: 'Fatal Error',
        text: 'User could not be removed.',
        background: '#1b2028',
        color: '#fff',
      });
    } else {
      await this.getUsers();
    }
  }

  async newConversion(conversion: object) {
    var userId = this.authService.user?.id;
    if (!userId) {
      throw new Error('User not authenticated.');
    }

    const res = await fetch(
      environment.API_URL + `user/${userId}/new-conversion`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(conversion),
      }
    );
    if (res.status !== 201) {
      console.error('Failed to save conversion.');
    } else {
      await this.getUserHistory(userId);
    }
  }

  async getFavorites(userId: number) {
    const res = await fetch(environment.API_URL + `user/${userId}/favorites`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: ICurrency[] = await res.json();
    this.favoriteCurrenciesSubject.next(resJson);
    return resJson;
  }

  async toggleFavorite(isoCode: string) {
    var userId = this.authService.user?.id;
    if (!userId) {
      throw new Error('User not authenticated.');
    }

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
      await this.getFavorites(userId);
    }
  }

  async getUserHistory(userId: number) {
    const res = await fetch(environment.API_URL + `user/${userId}/history`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: IHistory[] = await res.json();
    this.historySubject.next(resJson);
    return resJson;
  }
}
