import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CurrencyService } from '../../services/currency.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  currencyService = inject(CurrencyService);

  removeUser(userId: number) {
    Swal.fire({
      title: 'Do you wish to remove this user?',
      text: 'This action cannot be reversed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f49d00',
      cancelButtonColor: '#d33',
      background: '#1b2028',
      color: '#fff',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.userService.deleteUser(userId);
      }
    });
  }

  removeCurrency(isoCode: string, name: string) {
    Swal.fire({
      title: `Do you wish to remove ${name}?`,
      text: 'This action cannot be reversed and the currency will no longer be listed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f49d00',
      cancelButtonColor: '#d33',
      background: '#1b2028',
      color: '#fff',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.currencyService.deleteCurrency(isoCode);
      }
    });
  }

  addCurrency() {
    let newCurrency = {};
    let nameInput: HTMLInputElement;
    let symbolInput: HTMLInputElement;
    let codeInput: HTMLInputElement;
    let exrInput: HTMLInputElement;

    Swal.fire({
      title: 'New Currency',
      html: `
        <input type="text" id="name" class="swal2-input" placeholder="Currency name">
        <input type="text" id="symbol" class="swal2-input" placeholder="Symbol">
        <input type="text" id="code" class="swal2-input" placeholder="ISO 4217">
        <input type="number" id="EXR" class="swal2-input" placeholder="Exchange rate">
      `,
      showCancelButton: true,
      confirmButtonColor: '#f49d00',
      cancelButtonColor: '#d33',
      background: '#1b2028',
      color: '#fff',
      didOpen: () => {
        const popup = Swal.getPopup()!;
        nameInput = popup.querySelector('#name') as HTMLInputElement;
        symbolInput = popup.querySelector('#symbol') as HTMLInputElement;
        codeInput = popup.querySelector('#code') as HTMLInputElement;
        exrInput = popup.querySelector('#EXR') as HTMLInputElement;
        nameInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
        symbolInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
        codeInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
        exrInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
      },
      preConfirm: () => {
        const name = nameInput.value;
        const symbol = symbolInput.value;
        const isoCode = codeInput.value;
        const exchangeRate = exrInput.value;
        if (!name || !symbol || !isoCode || !exchangeRate) {
          Swal.showValidationMessage('All fields are required.');
        }
        return (newCurrency = { name, symbol, isoCode, exchangeRate });
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const value = result.value;
        await this.currencyService.newCurrency(value);
      }
    });
  }

  updateRate(isoCode: string, name: string) {
    Swal.fire({
      title: `Update ${name}'s Exchange Rate?`,
      html: `<input type="number" id="rate" class="swal2-input" placeholder="Input new value">`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f49d00',
      cancelButtonColor: '#d33',
      background: '#1b2028',
      color: '#fff',
      preConfirm: () => {
        const rateInput = document.getElementById('rate') as HTMLInputElement;
        if (!rateInput || !rateInput.value) {
          Swal.showValidationMessage('Please input a new exchange rate.');
          return false;
        }
        return { value: rateInput.value };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value } = result.value;
        await this.currencyService.updateRate(isoCode, value);
      }
    });
  }
}
