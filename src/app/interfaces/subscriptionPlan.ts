import { IUser } from './user';

export interface ISubscriptionPlan {
  name: string;
  description: string;
  price: number;
  maxConversions: number | null;
  users: IUser | undefined;
}
