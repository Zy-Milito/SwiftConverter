import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IRegister } from '../../interfaces/register';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  errorReg = false;
  async register(regForm: NgForm) {
    const { username, email, password } = regForm.value;
    const regData: IRegister = { username, email, password };

    const res = await this.authService.register(regData);

    if (res?.statusText === 'Created') this.router.navigate(['/login']);
    else this.errorReg = true;
  }
}
