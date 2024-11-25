import { Component, inject } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss',
})
export class SubscriptionComponent {
  subscriptionService = inject(SubscriptionService);
}
