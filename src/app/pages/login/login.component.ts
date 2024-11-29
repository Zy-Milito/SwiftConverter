import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ILogin } from '../../interfaces/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  errorLogin = false;
  async login(loginForm: NgForm) {
    const { username, password } = loginForm.value;
    const loginData: ILogin = { username, password };

    const res = await this.authService.login(loginData);

    if (res?.username) this.router.navigate(['/dashboard']);
    else this.errorLogin = true;
  }
}
