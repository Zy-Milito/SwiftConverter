import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-conversions',
  standalone: true,
  imports: [],
  templateUrl: './conversions.component.html',
  styleUrl: './conversions.component.scss',
})
export class ConversionsComponent {
  userService = inject(UserService);
}
