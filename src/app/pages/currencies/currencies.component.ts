import { Component, inject } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss',
})
export class CurrenciesComponent {
  currencyService = inject(CurrencyService);
  userService = inject(UserService);

  async addFavorite(isoCode: string) {
    return await this.userService.toggleFavorite(isoCode);
  }
}
