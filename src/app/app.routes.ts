import { Routes } from '@angular/router';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

export const routes: Routes = [
  { path: "", redirectTo: 'search/home', pathMatch: 'full' },
  { path: "search/:ticker", component: SearchbarComponent },
  { path: "watchlist", component: WatchlistComponent },
  { path: "portfolio", component: PortfolioComponent }
];