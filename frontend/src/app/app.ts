import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  showNavbar = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const authPages = ['/login', '/register'];
      this.showNavbar = !authPages.includes(event.url);
    });
  }
}



// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { NavbarComponent } from './components/navbar/navbar';
// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, NavbarComponent],
//   templateUrl: './app.html',
//   styleUrls: ['./app.scss']
// })
// export class App {
//   protected title = 'expense-tracker';
// }



// import { Component, signal } from '@angular/core';
// import { NavbarComponent } from './components/navbar/navbar';
// import { DashboardComponent } from './components/dashboard/dashboard';
// import { OnInit } from '@angular/core';
// import { ApiService } from './services/api.service';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [NavbarComponent, DashboardComponent],
//   templateUrl: './app.html',
//   styleUrls: ['./app.scss']
// })
// export class App implements OnInit {

//   protected readonly title = signal('expense-tracker');
//   selectedMonth: string = new Date().toISOString().slice(0, 7);

//   constructor(private api: ApiService) {}

//   ngOnInit() {
//     this.api.test().subscribe({
//       next: (res) => {
//         console.log('Backend says:', res);
//       },
//       error: (err) => {
//         console.error('Backend error:', err);
//       }
//     });
//   }
// }

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