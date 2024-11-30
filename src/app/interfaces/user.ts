import { ICurrency } from './currency';
import { IHistory } from './history';

export interface IUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  subscriptionPlanId: number;
  favedCurrencies: ICurrency[] | undefined;
  conversionHistory: IHistory[] | undefined;
  accountStatus: boolean;
}
