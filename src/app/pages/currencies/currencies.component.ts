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

  isFavorite(isoCode: string): boolean {
    const favorites = this.userService.favoriteCurrenciesSubject.value;
    return favorites.some((currency) => currency.isoCode === isoCode);
  }

  async addFavorite(isoCode: string) {
    return await this.userService.toggleFavorite(isoCode);
  }

  async removeFavorite(isoCode: string) {
    return await this.userService.toggleFavorite(isoCode);
  }
}
