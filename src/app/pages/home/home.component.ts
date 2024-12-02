import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';
import { FormsModule, NgForm } from '@angular/forms';
import { IConversion } from '../../interfaces/conversion';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  authService = inject(AuthService);
  currencyService = inject(CurrencyService);
  subscriptionService = inject(SubscriptionService);
  userService = inject(UserService);
  lastConversion: number | undefined;

  async convert(conversionForm: NgForm) {
    const { fromCurrencyId, amount, toCurrencyId } = conversionForm.value;
    const conversionData: IConversion = {
      fromCurrencyId,
      amount,
      toCurrencyId,
    };

    const res = await this.currencyService.convert(conversionData);
    this.lastConversion = res;
    return res;
  }

  async removeFavorite(isoCode: string) {
    return await this.userService.toggleFavorite(isoCode);
  }
}
