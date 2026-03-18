import { Component, signal } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar';
import { DashboardComponent } from './components/dashboard/dashboard';
import { OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, DashboardComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {

  protected readonly title = signal('expense-tracker');
  selectedMonth: string = new Date().toISOString().slice(0, 7);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.test().subscribe({
      next: (res) => {
        console.log('Backend says:', res);
      },
      error: (err) => {
        console.error('Backend error:', err);
      }
    });
  }
}

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [NavbarComponent, DashboardComponent],
//   templateUrl: './app.html',
//   styleUrls: ['./app.scss']
// })
// export class App {
//   protected readonly title = signal('expense-tracker');
//   selectedMonth: string = new Date().toISOString().slice(0, 7);
// }

// export class App implements OnInit {

//   constructor(private api: ApiService) {}

//   ngOnInit() {
//     this.api.test().subscribe(res => {
//       console.log('Backend says:', res);
//     });
//   }
// }