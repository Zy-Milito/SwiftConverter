import { Component, inject } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss',
})
export class CurrenciesComponent {
  currencyService = inject(CurrencyService);
}
