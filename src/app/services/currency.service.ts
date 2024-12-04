import { inject, Injectable } from '@angular/core';
import { ICurrency } from '../interfaces/currency';
import { environment } from '../../environments/environment.development';
import { IConversion } from '../interfaces/conversion';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  userService = inject(UserService);
  authService = inject(AuthService);
  private currenciesSubject: BehaviorSubject<ICurrency[]> = new BehaviorSubject<
    ICurrency[]
  >([]);
  public currencies$ = this.currenciesSubject.asObservable();

  constructor() {
    this.loadData();
  }

  async loadData() {
    await this.getCurrencies();
  }

  async getCurrencies(): Promise<ICurrency[]> {
    try {
      const res = await fetch(environment.API_URL + 'currency/currencies', {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      });
      if (res.status !== 200) throw new Error('Failed to fetch currencies.');

      const resJson: ICurrency[] = await res.json();
      this.currenciesSubject.next(resJson);
      return resJson;
    } catch (error) {
      console.error('Error fetching currencies: ', error);
      return [];
    }
  }

  async convert(conversionData: IConversion) {
    try {
      let currencies = this.currenciesSubject.value;
      if (currencies.length === 0) {
        currencies = await this.getCurrencies();
      }

      var fromRate = currencies.find(
        (c) => c.id == conversionData.fromCurrencyId
      )?.exchangeRate;
      var toRate = currencies.find(
        (c) => c.id == conversionData.toCurrencyId
      )?.exchangeRate;

      if (!fromRate || !toRate) {
        throw new Error('Rates not found.');
      }

      const usd = currencies.find((c) => c.isoCode == 'USD')?.exchangeRate;
      if (!usd) {
        throw new Error('Base currency not valid.');
      }
      var toUSD = (conversionData.amount * fromRate) / usd;
      var result = (toUSD / toRate) * usd;
      result = Math.round((result + Number.EPSILON) * 100) / 100;

      await this.userService.newConversion(conversionData);
      this.authService.user!.conversionsLeft = (
        parseInt(this.authService.user!.conversionsLeft) - 1
      ).toString();

      return result;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Fatal Error',
        text: 'Error during conversion.',
        background: '#1b2028',
        color: '#fff',
      });
      throw error;
    }
  }

  async updateRate(isoCode: string, newRate: number) {
    const res = await fetch(
      environment.API_URL + 'currency/' + isoCode + '/update',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(newRate),
      }
    );
    if (res.status !== 200) {
      Swal.fire({
        icon: 'error',
        title: 'Fatal Error',
        text: 'Rate could not be updated.',
        background: '#1b2028',
        color: '#fff',
      });
    } else {
      this.loadData();
    }
  }

  async newCurrency(newCurrency: object) {
    const res = await fetch(environment.API_URL + 'currency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
      body: JSON.stringify(newCurrency),
    });

    if (res.status !== 201) {
      Swal.fire({
        icon: 'error',
        title: 'Fatal Error',
        text: 'Failed to create new currency.',
        background: '#1b2028',
        color: '#fff',
      });
    } else {
      this.loadData();
    }
  }

  async deleteCurrency(isoCode: string) {
    const res = await fetch(environment.API_URL + `currency/${isoCode}`, {
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
        text: 'Currency could not be removed.',
        background: '#1b2028',
        color: '#fff',
      });
    } else {
      this.loadData();
    }
  }
}
