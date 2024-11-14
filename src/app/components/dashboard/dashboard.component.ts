import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  authService = inject(AuthService);
  router = inject(Router);
  admin = this.authService.user?.isAdmin;

  logout() {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
