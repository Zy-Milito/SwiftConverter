import { inject, Injectable } from '@angular/core';
import { ICurrency } from '../interfaces/currency';
import { environment } from '../../environments/environment.development';
import { IConversion } from '../interfaces/conversion';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  authService = inject(AuthService);
  userService = inject(UserService);
  currencies: ICurrency[] = [];

  constructor() {
    this.loadData();
  }

  async loadData() {
    await this.getCurrencies();
  }

  async getCurrencies() {
    const res = await fetch(environment.API_URL + 'currency/currencies', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: ICurrency[] = await res.json();
    this.currencies = resJson;
    return resJson;
  }

  async convert(conversionData: IConversion) {
    try {
      var fromRate = this.currencies.find(
        (c) => c.id == conversionData.fromCurrency
      )?.exchangeRate;
      var toRate = this.currencies.find(
        (c) => c.id == conversionData.toCurrency
      )?.exchangeRate;

      if (!fromRate || !toRate) {
        throw new Error('Rates not found.');
      }

      const usd = 1;
      var toUSD = (conversionData.amount * fromRate) / usd;
      var result = (toUSD / toRate) * usd;
      result = Math.round((result + Number.EPSILON) * 100) / 100;

      return result;
    } catch (error) {
      console.error('Error during conversion: ', error);
      throw error;
    }
  }
}
