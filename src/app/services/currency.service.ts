import { Injectable } from '@angular/core';
import { ICurrency } from '../interfaces/currency';
import { environment } from '../../environments/environment.development';
import { IConversion } from '../interfaces/conversion';

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

  async convert(conversionData: IConversion) {
    var usd = 1;
    var toUSD = (conversionData.amount * conversionData.fromCurrency) / usd;
    var result = (toUSD / conversionData.toCurrency) * usd;
    result = Math.round((result + Number.EPSILON) * 100) / 100;

    return result;
  }
}
