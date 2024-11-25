import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { CurrenciesComponent } from './pages/currencies/currencies.component';
import { ConversionsComponent } from './pages/conversions/conversions.component';
import { publicGuard } from './guards/public.guard';
import { loggedGuard } from './guards/logged.guard';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { AdminComponent } from './pages/admin/admin.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [loggedGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'currencies',
        component: CurrenciesComponent,
      },
      {
        path: 'conversions',
        component: ConversionsComponent,
      },
      {
        path: 'subscription',
        component: SubscriptionComponent,
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [adminGuard],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '/not-found',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];
