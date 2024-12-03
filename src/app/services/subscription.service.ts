import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ISubscriptionPlan } from '../interfaces/subscriptionPlan';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { IUpgradeData } from '../interfaces/upgradeData';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  public subscriptionPlansSubject: BehaviorSubject<ISubscriptionPlan[]> =
    new BehaviorSubject<ISubscriptionPlan[]>([]);
  public subscriptionPlans$ = this.subscriptionPlansSubject.asObservable();

  private currentSubscriptionPlanSubject: BehaviorSubject<
    ISubscriptionPlan | undefined
  > = new BehaviorSubject<ISubscriptionPlan | undefined>(undefined);
  public currentSubscriptionPlan$ =
    this.currentSubscriptionPlanSubject.asObservable();

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.getCurrentPlan(user.id);
      } else {
        this.currentSubscriptionPlanSubject.next(undefined);
      }
    });
    this.loadData();
  }

  async loadData() {
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
    this.subscriptionPlansSubject.next(resJson);
    return resJson;
  }

  async getCurrentPlan(userId: number) {
    const res = await fetch(environment.API_URL + `plan/${userId}`, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: ISubscriptionPlan = await res.json();
    this.currentSubscriptionPlanSubject.next(resJson);
    return resJson;
  }

  async upgradePlan(upgradeData: IUpgradeData) {
    var userId = this.authService.user?.id;
    var username = this.authService.user?.username;
    if (!userId) {
      throw new Error('User not authenticated.');
    }

    if (username != upgradeData.holder) {
      Swal.fire({
        icon: 'error',
        title: 'Incorrect Username',
        text: 'Error! Unable to upgrade your subscription.',
        background: '#1b2028',
        color: '#fff',
      });
      return;
    }

    const res = await fetch(
      environment.API_URL + `user/${userId}/upgrade-plan`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(upgradeData.newPlanName),
      }
    );
    if (res.status === 200) {
      await this.getCurrentPlan(userId);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Fatal Error',
        text: 'Error! Unable to upgrade your subscription.',
        background: '#1b2028',
        color: '#fff',
      });
    }
  }

  async upgradePlanAdmin(userId: number, newPlanName: string) {
    const res = await fetch(
      environment.API_URL + `user/${userId}/upgrade-plan`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(newPlanName),
      }
    );
    if (res.status === 200) {
      await this.getCurrentPlan(userId);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Fatal Error',
        text: 'Error! Unable to upgrade the subscription.',
        background: '#1b2028',
        color: '#fff',
      });
    }
  }
}
