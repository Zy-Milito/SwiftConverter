import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversions.component.html',
  styleUrl: './conversions.component.scss',
})
export class ConversionsComponent {
  userService = inject(UserService);
}
