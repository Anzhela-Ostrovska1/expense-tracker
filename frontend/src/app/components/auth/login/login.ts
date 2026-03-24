import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
   selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class LoginComponent{
 email= ""
 password= ""
 errorMessage = ''


 constructor(
  private authService: AuthService,
  private router: Router
  ) {}

onLogin(){
  this.authService.login(this.email,this.password)
  .subscribe({
    next:(response)=>{
this.authService.saveToken(response.token);
this.router.navigate(['/dashboard'])
    },
    error:(err)=>{
      this.errorMessage = err.error?.error || "Login failed";
    }})
    }
  
}

