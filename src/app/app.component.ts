import { Component, OnInit } from '@angular/core';
import { NavigationEnd, ParamMap, Router } from '@angular/router';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { FormsModule } from '@angular/forms';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SearchbarComponent,
    WatchlistComponent,
    FormsModule,
    PortfolioComponent,
    CommonModule,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stock-search';

  activeComponent = 'search';
  searchActive: boolean = true;
  watchlistActive: boolean = false;
  portfolioActive:boolean = false;
  active$: BehaviorSubject<string> = new BehaviorSubject<string>('search');


  setActiveComponent(componentName: string): void {
    this.activeComponent = componentName;
  }

}

// export class AppComponent implements OnInit {
//   activeComponent: string = 'search';
//   myParam: string = '';

//   constructor(private router: Router, private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe((params: ParamMap) => {
//       // this.myParam = params.get();
//       console.log("inside");
//     });
//   }

//   setActiveComponent(url: string): void {
//     if (url.includes('search')) {
//       this.activeComponent = 'search';
//     } else if (url.includes('watchlist')) {
//       this.activeComponent = 'watchlist';
//     } else if (url.includes('portfolio')) {
//       this.activeComponent = 'portfolio';
//     }
//   }
// }
