import { inject, Injectable } from '@angular/core';
import { ICurrency } from '../interfaces/currency';
import { environment } from '../../environments/environment.development';
import { IConversion } from '../interfaces/conversion';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
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
        (c) => c.id == conversionData.fromCurrencyId
      )?.exchangeRate;
      var toRate = this.currencies.find(
        (c) => c.id == conversionData.toCurrencyId
      )?.exchangeRate;

      if (!fromRate || !toRate) {
        throw new Error('Rates not found.');
      }

      const usd = this.currencies.find((c) => c.isoCode == 'USD')?.exchangeRate;
      if (!usd) {
        throw new Error('Base currency not valid.');
      }
      var toUSD = (conversionData.amount * fromRate) / usd;
      var result = (toUSD / toRate) * usd;
      result = Math.round((result + Number.EPSILON) * 100) / 100;

      await this.userService.newConversion(conversionData);

      return result;
    } catch (error) {
      console.error('Error during conversion: ', error);
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
      console.error('Rate could not be updated.');
    } else {
      console.log('Currency rate updated.');
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

    if (res.status !== 200) {
      console.error('Failed to create new currency.');
    } else {
      console.log('Creation successful.');
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
      console.error('Currency could not be removed.');
    } else {
      console.log('Currency removed.');
      this.loadData();
    }
  }
}
