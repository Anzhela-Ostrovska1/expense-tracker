import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../hero/hero';
import { ToastService } from '../../../services/toast';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterLink, HeroComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  email = '';
  password = '';
  username = '';
  errorMessage = '';
   isLoading = false;
  

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  onRegister() {
  this.authService.register(this.email, this.password, this.username).subscribe({
    next: (response) => {
      this.authService.saveUser(response.token, response.user.username);
      this.toast.success('Account created!');
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.errorMessage = err.error?.error || 'Registration failed';
      this.toast.error(this.errorMessage); 
    }
     });
}
}


