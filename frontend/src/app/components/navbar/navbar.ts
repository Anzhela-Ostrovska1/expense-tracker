import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MonthService } from '../../services/month';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class NavbarComponent implements OnInit {
  selectedMonth!: string;
  username: string | null = null;
  loggedIn = false;

  constructor(
    private monthService: MonthService,
    private authService: AuthService,
    private router: Router
  ) {}

  availableMonths = this.generateMonths();

generateMonths() {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      value: date.toISOString().slice(0, 7),
      label: date.toLocaleString('en', { month: 'long', year: 'numeric' })
    });
  }
  return months;
}
  
ngOnInit() {
  this.selectedMonth = this.monthService.getMonth();
  this.username = this.authService.getUsername();
  this.loggedIn = this.authService.isLoggedIn(); 
}

  onMonthChange(month: string) {
    this.monthService.setMonth(month);
    this.selectedMonth = month;
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}