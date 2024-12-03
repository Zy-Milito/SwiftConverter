import { Component, inject } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { IUpgradeData } from '../../interfaces/upgradeData';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss',
})
export class SubscriptionComponent {
  subscriptionService = inject(SubscriptionService);

  upgradeSubscription(newPlanName: string) {
    let upgradeData: IUpgradeData;
    let cardInput: HTMLInputElement;
    let cvvInput: HTMLInputElement;
    let expInput: HTMLInputElement;
    let holderInput: HTMLInputElement;

    Swal.fire({
      title: 'Upgrade Plan',
      html: `
        <input type="text" id="cardNumber" class="swal2-input" maxlength="16" placeholder="Card Number">
        <input type="text" id="cvv" class="swal2-input" maxlength="4" placeholder="CVV">
        <input type="date" id="exp" class="swal2-input" placeholder="Expiration Date">
        <input type="text" id="holder" class="swal2-input" placeholder="Card Holder">
      `,
      showCancelButton: true,
      confirmButtonColor: '#f49d00',
      cancelButtonColor: '#d33',
      background: '#1b2028',
      color: '#fff',
      didOpen: () => {
        const popup = Swal.getPopup()!;
        cardInput = popup.querySelector('#cardNumber') as HTMLInputElement;
        cvvInput = popup.querySelector('#cvv') as HTMLInputElement;
        expInput = popup.querySelector('#exp') as HTMLInputElement;
        holderInput = popup.querySelector('#holder') as HTMLInputElement;
        cardInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
        cvvInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
        expInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
        holderInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
      },
      preConfirm: () => {
        const card = Number(cardInput.value);
        const cvv = Number(cvvInput.value);
        const expDate = expInput.value;
        const holder = holderInput.value;
        if (!card || !cvv || !expDate || !holder) {
          Swal.showValidationMessage('All fields are required!');
        }
        return (upgradeData = {
          card,
          cvv,
          expDate,
          holder,
          newPlanName,
        });
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const value = result.value;
        await this.subscriptionService.upgradePlan(value);
      }
    });
  }
}
