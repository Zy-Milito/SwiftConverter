import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ISubscriptionPlan } from '../interfaces/subscriptionPlan';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  subscriptionPlans: ISubscriptionPlan[] = [];

  constructor() {
    this.getPlans();
  }

  async getPlans() {
    const res = await fetch(environment.API_URL + 'plan/plans', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: ISubscriptionPlan[] = await res.json();
    this.subscriptionPlans = resJson;
  }
}
