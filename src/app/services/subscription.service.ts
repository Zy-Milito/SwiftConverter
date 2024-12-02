import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ISubscriptionPlan } from '../interfaces/subscriptionPlan';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  authService = inject(AuthService);
  subscriptionPlans: ISubscriptionPlan[] = [];
  currentSubscriptionPlan: ISubscriptionPlan | undefined;

  constructor() {
    this.loadData();
  }

  async loadData() {
    this.getPlans();
    this.getCurrentPlan();
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
    return resJson;
  }

  async getCurrentPlan() {
    var userId = this.authService.user?.id;
    const res = await fetch(environment.API_URL + `plan/${userId}`, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: ISubscriptionPlan = await res.json();
    this.currentSubscriptionPlan = resJson;
    return resJson;
  }

  async upgradePlan(userId: number, newPlanId: number) {
    const res = await fetch(environment.API_URL + `${userId}/upgrade-plan`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
      body: JSON.stringify(newPlanId),
    });
    if (res.status === 200) {
      this.getCurrentPlan();
    } else {
      console.warn('Error! Unable to upgrade your subscription.');
    }
  }
}
