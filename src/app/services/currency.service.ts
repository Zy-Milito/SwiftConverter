import { Injectable } from '@angular/core';
import { ICurrency } from '../interfaces/currency';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
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
  }
}
