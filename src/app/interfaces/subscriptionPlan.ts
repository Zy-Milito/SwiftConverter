import { IUser } from './user';

export interface ISubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  maxConversions: number | null;
  users: IUser | undefined;
}
