import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { HeroComponent } from '../hero/hero';
import { ToastService } from '../../../services/toast';

@Component({
   selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink, HeroComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class LoginComponent{
 email= ""
 password= ""
 errorMessage = ''
 isLoading = false;


 constructor(
  private authService: AuthService,
  private router: Router,
   private toast: ToastService
  ) {}

  onLogin() {
  this.isLoading = true;
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      this.authService.saveUser(response.token, response.user.username);
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err.error?.error || 'Login failed';
      this.toast.error(this.errorMessage); 
    }
  });
}
}

