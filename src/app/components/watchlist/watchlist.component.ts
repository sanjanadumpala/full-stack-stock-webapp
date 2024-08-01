import { Item } from './../../models/watchlist.model';
import { Component } from '@angular/core';
import { AutocompleteService } from '../../services/autocomplete.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent {

  watchlist_info: any[] = [];
  company_info: any[] = [];
  stock_info: any[] = [];
  print_info: Item[] = [];
  hasItems: boolean = false;

  isContentLoading = true;

  constructor(
    private autocompleteService: AutocompleteService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.displayWatchlist();
  }

  removeCard(ticker: string) {
    this.autocompleteService.removeFromWatchlist(ticker).subscribe(data => {
      this.watchlist_info = data;
      this.displayWatchlist()
  });
  }

  displayWatchlist () {
    this.isContentLoading = true;
    this.print_info = [];
    this.autocompleteService.getWatchlist().subscribe(data => {
      this.watchlist_info = data;
      if (this.watchlist_info.length === 0) {
        this.hasItems = false;
      }

      for (let i = 0; i < this.watchlist_info.length; i++) {
        this.hasItems = true;
        let caretstyle: string = '';
        let color: {'color': string};
        forkJoin([
          this.autocompleteService.fetchCompanyData(this.watchlist_info[i].ticker),
          this.autocompleteService.fetchStockData(this.watchlist_info[i].ticker),
        ]).subscribe(([data1, data2]) => {
          this.company_info = data1;
          this.stock_info = data2;
          if (this.stock_info[0].d < 0) {
            caretstyle = "fa-solid fa-caret-down";
            color = {'color': 'red'};
          }
          else if (this.stock_info[0].d = 0) {
            caretstyle = "";
            color = {'color': 'black'};
          }
          else {
            caretstyle = "fa-solid fa-caret-up";
            color = {'color': 'green'};
          }
          const tempPrintInfo: Item = {
            ticker: this.watchlist_info[i].ticker,
            name: this.company_info[0].name,
            currentprice: this.stock_info[0].c,
            change: this.stock_info[0].d,
            changepercent: this.stock_info[0].dp,
            caretstyle: caretstyle,
            color: color
          };
          this.print_info.push(tempPrintInfo);
        });
      }
      this.isContentLoading = false;
    });
  }

  onClick (ticker: string) {
    this.router.navigate(['/search', ticker]);
  }
}
