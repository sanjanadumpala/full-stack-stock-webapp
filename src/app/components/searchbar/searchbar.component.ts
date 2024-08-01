import { AutocompleteService } from './../../services/autocomplete.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SummaryComponent } from '../summary/summary.component';
import { interval, Subscription } from 'rxjs';
import { TopnewsComponent } from '../topnews/topnews.component';
import { ChartsComponent } from '../charts/charts.component';
import { InsightsComponent } from '../insights/insights.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { forkJoin } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuymodalComponent } from '../buymodal/buymodal.component';
import { SellmodalComponent } from '../sellmodal/sellmodal.component';
import { Item } from './../../models/state.model';
import { of } from 'rxjs';



@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    ReactiveFormsModule, 
    SummaryComponent,
    TopnewsComponent,
    ChartsComponent,
    InsightsComponent,
    FontAwesomeModule,
    BuymodalComponent,
    SellmodalComponent
  ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css',
})

export class SearchbarComponent {
  company_info: any[] = []; 
  stock_info: any[] = [];
  peer_info: any[] = [];
  graph_info: any[] = [];
  news_info: any[] = [];
  trend_info: any[] = [];
  sentiment_info: any[] = [];
  earning_info: any[] = [];
  watchlist_info: any[] = [];
  watchlist_check_info: any[] = [];
  portfolio_info: any[] = [];
  portfolio_check_info: any[] = [];
  wallet_info: any[] = [];
  graph_info2: any[] = [];
  searchQuery = new FormControl();
  suggestions: any[] = [];
  isContentLoading = false;
  isLoading = false;
  initialLoading = false;
  showBaseInfo = false;
  activeMenuItem = 'summary';
  ticker: string = '';
  IsMarketOpen: boolean = false;
  watchlistToggle: boolean = false;
  caretStyle: string = '';
  showAddAlert: boolean = false;
  showRemoveAlert: boolean = false;
  showPAddAlert: boolean = false;
  showPRemoveAlert: boolean = false;
  currentPrice: number = 0;
  moneyInWallet: string = '25000.00';
  inputValue: number = 0;
  showInvalidAlert: boolean = false;
  t: string = '';
  newTime: string = '';
  formValue: string = '';
  watchlistColor$: BehaviorSubject<{ color: string }> = new BehaviorSubject<{ color: string }>({ 'color': 'black' });
  wColor: {color: string} = {color: 'black'};
  watchlistStyle$: BehaviorSubject<string> = new BehaviorSubject<string>('fa-regular fa-star fa-xl');
  wStyle:string = 'fa-regular fa-star fa-xl';
  canSell$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  csell:boolean = false;
  state_info: Item[] = [];
  graphColor: string = '';
  constructor(
    private autocompleteService: AutocompleteService, 
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    ) {}
  private intervalSubscription!: Subscription;
  private searchSubscription: Subscription = new Subscription();

  @ViewChild('searchInput') searchInput!: ElementRef;


  clearSearch() {
    this.searchQuery.setValue('');
    this.router.navigate(['/search/home']);
    this.state_info = [];
    this.suggestions = [];
    this.showBaseInfo = false;
    this.IsMarketOpen = false;
    this.isLoading = false;
    this.isContentLoading = false;
    this.showInvalidAlert = false;
    this.initialLoading = false;
  }

  ngOnInit() {
    var t = this.route.snapshot.paramMap.get('ticker')
    if (t !== "home") {
      this.onSearch(t)
      return
    }
    this.getState();
  }

  getState() {
    const stateInfoJson = sessionStorage.getItem('routeState');
    if (stateInfoJson) {
      let convertedStateInfoJson = JSON.parse(stateInfoJson);
      if (convertedStateInfoJson.company_info.length === 0) {
        this.showBaseInfo = false;
        this.initiateSearchSubscription();
        this.getCurrentTime();
        this.initiateIterativeCall();
      }
      else {
        this.company_info = convertedStateInfoJson.company_info;
        this.stock_info = convertedStateInfoJson.stock_info;
        this.peer_info = convertedStateInfoJson.peer_info;
        this.graph_info = convertedStateInfoJson.graph_info;
        this.news_info = convertedStateInfoJson.news_info;
        this.trend_info = convertedStateInfoJson.trend_info;
        this.sentiment_info = convertedStateInfoJson.sentiment_info;
        this.earning_info = convertedStateInfoJson.earning_info;
        this.watchlist_info = convertedStateInfoJson.watchlist_info;
        this.watchlist_check_info = convertedStateInfoJson.watchlist_check_info;
        this.portfolio_info = convertedStateInfoJson.portfolio_info;
        this.portfolio_check_info = convertedStateInfoJson.portfolio_check_info;
        this.wallet_info = convertedStateInfoJson.wallet_info;
        this.graph_info2 = convertedStateInfoJson.graph_info2;
        this.searchQuery.setValue(convertedStateInfoJson.formValue);
        this.suggestions = convertedStateInfoJson.suggestions;
        this.isContentLoading = convertedStateInfoJson.isContentLoading;
        this.isLoading = convertedStateInfoJson.isLoading;
        this.initialLoading = convertedStateInfoJson.initialLoading;
        this.showBaseInfo = convertedStateInfoJson.showBaseInfo;
        this.activeMenuItem = convertedStateInfoJson.activeMenuItem;
        this.ticker = convertedStateInfoJson.ticker;
        this.IsMarketOpen = convertedStateInfoJson.IsMarketOpen;
        this.watchlistToggle = convertedStateInfoJson.watchlistToggle;
        this.caretStyle = convertedStateInfoJson.caretStyle;
        this.showAddAlert = false;
        this.showRemoveAlert = false;
        this.showPAddAlert = false;
        this.showPRemoveAlert = false;
        this.currentPrice = convertedStateInfoJson.currentPrice;
        this.moneyInWallet = convertedStateInfoJson.moneyInWallet;
        this.inputValue = convertedStateInfoJson.inputValue;
        this.showInvalidAlert = convertedStateInfoJson.showInvalidAlert;
        this.t = convertedStateInfoJson.t;
        this.newTime = convertedStateInfoJson.newTime;
        this.router.navigate(['/search', this.searchQuery.value]);
        this.watchlistColor$.next(convertedStateInfoJson.wColor);
        this.watchlistStyle$.next(convertedStateInfoJson.wStyle);
        this.canSell$.next(convertedStateInfoJson.cSell);

        this.initiateSearchSubscription();
        this.getCurrentTime();
        this.initiateIterativeCall();
        this.autocompleteService.getPortfolio().subscribe(data => {
          this.portfolio_info = data;
          this.checkWatchlist(this.ticker);
        });
      }
    }
    else {
      this.initiateSearchSubscription();
      this.getCurrentTime();
      this.initiateIterativeCall();
    }
  }

  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
    this.saveState();
  }

  saveState() {
    if (this.searchQuery.value === '') {
      const stateInfo: Item = {
        company_info: [],
        stock_info: [],
        peer_info: [],
        graph_info: [],
        news_info: [],
        trend_info: [],
        sentiment_info: [],
        earning_info: [],
        watchlist_info: [],
        watchlist_check_info: [],
        portfolio_info: [],
        portfolio_check_info: [],
        wallet_info: [],
        graph_info2: [],
        formValue: '',
        suggestions: [],
        isContentLoading: false,
        isLoading: false,
        initialLoading: false,
        showBaseInfo: false,
        activeMenuItem: 'summary',
        ticker: '',
        IsMarketOpen: false,
        watchlistToggle: false,
        caretStyle: '',
        showAddAlert: false,
        showRemoveAlert: false,
        showPAddAlert: false,
        showPRemoveAlert: false,
        currentPrice: 0,
        moneyInWallet: '25000.00',
        inputValue: 0,
        showInvalidAlert: false,
        t: '',
        newTime: '',
        wColor: {color: 'black'},
        wStyle: 'fa-regular fa-star fa-xl',
        cSell: false
      };
      const stateInfoJson = JSON.stringify(stateInfo);
      sessionStorage.setItem('routeState', stateInfoJson);
    }
    else {
      const stateInfo: Item = {
        company_info: this.company_info,
        stock_info: this.stock_info,
        peer_info: this.peer_info,
        graph_info: this.graph_info,
        news_info: this.news_info,
        trend_info: this.trend_info,
        sentiment_info: this.sentiment_info,
        earning_info: this.earning_info,
        watchlist_info: this.watchlist_info,
        watchlist_check_info: this.watchlist_check_info,
        portfolio_info: this.portfolio_info,
        portfolio_check_info: this.portfolio_check_info,
        wallet_info: this.wallet_info,
        graph_info2: this.graph_info2,
        formValue: this.searchQuery.value,
        suggestions: this.suggestions,
        isContentLoading: this.isContentLoading,
        isLoading: this.isLoading,
        initialLoading: this.initialLoading,
        showBaseInfo: this.showBaseInfo,
        activeMenuItem: this.activeMenuItem,
        ticker: this.ticker,
        IsMarketOpen: this.IsMarketOpen,
        watchlistToggle: this.watchlistToggle,
        caretStyle: this.caretStyle,
        showAddAlert: this.showAddAlert,
        showRemoveAlert: this.showRemoveAlert,
        showPAddAlert: this.showPAddAlert,
        showPRemoveAlert: this.showPRemoveAlert,
        currentPrice: this.currentPrice,
        moneyInWallet: this.moneyInWallet,
        inputValue: this.inputValue,
        showInvalidAlert: this.showInvalidAlert,
        t: this.t,
        newTime: this.newTime,
        wColor: this.watchlistColor$.value,
        wStyle: this.watchlistStyle$.value,
        cSell: this.canSell$.value
      };
      const stateInfoJson = JSON.stringify(stateInfo);
      sessionStorage.setItem('routeState', stateInfoJson);
    }
  }

  // The following code was adapted from a solution provided by OpenAI's Assistant.
  // initiateSearchSubscription() {
  //   this.searchSubscription = this.searchQuery.valueChanges.pipe(
  //     debounceTime(300),
  //     distinctUntilChanged(),
  //     filter(term => term.length > 0),
  //     switchMap(term => {
  //       this.suggestions = [];
  //       this.initialLoading = true;
  //       this.isLoading = true;
  //       return this.autocompleteService.autocompleteData(term)
  //     })).subscribe(data => {
  //       this.suggestions = data;
  //       this.isLoading = false;
  //     });
  // }

  // The following code was adapted from a solution provided by OpenAI's Assistant.
  initiateSearchSubscription() {
    this.searchSubscription = this.searchQuery.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length === 0) {
          this.suggestions = [];
          this.initialLoading = false;
          this.isLoading = false;
          return of([]);
        } else {
          this.suggestions = [];
          this.initialLoading = true;
          this.isLoading = true;
          return this.autocompleteService.autocompleteData(term);
        }
      }),
      filter(data => data.length > 0)
    ).subscribe(data => {
      this.suggestions = data;
      this.isLoading = false;
    });
  }

  initiateIterativeCall() {
    this.intervalSubscription = interval(15000).subscribe(() => {
      this.getCurrentTime();
      if (this.IsMarketOpen && this.ticker) {
        this.fetchStockDataFn(this.ticker);
      }
    });
  }

  getCurrentTime() {
    let tempTime = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: 'America/Los_Angeles'
    };
    this.newTime = tempTime.toLocaleTimeString("en-US", options);
    this.newTime = this.newTime.replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$3-$1-$2');
  }

  fetchStockDataFn(ticker: string) {
    this.autocompleteService.fetchStockData(ticker).subscribe(data => {
      this.stock_info = data;
    });
  }

  onSearch(searchTerm: any) {
    this.activeMenuItem = "summary"
    this.showBaseInfo = false;
    if (searchTerm === null) {
      this.showInvalidAlert = false;
      this.isContentLoading = false;
      this.showBaseInfo = false;
      this.showInvalidAlert = true;
      return;
    }
    searchTerm = searchTerm.toUpperCase();
    this.searchQuery.setValue(searchTerm);
    this.searchSubscription.unsubscribe();
    this.initialLoading = false;
    this.initiateSearchSubscription();
    if (this.intervalSubscription === undefined) {
      this.initiateIterativeCall();
    }
    this.suggestions = [];
    this.ticker = searchTerm;
    this.isContentLoading = true;

    forkJoin([
      this.autocompleteService.fetchCompanyData(this.ticker),
      this.autocompleteService.fetchStockData(this.ticker),
      this.autocompleteService.fetchPeerData(this.ticker),
      this.autocompleteService.fetchGraphData(this.ticker),
      this.autocompleteService.fetchNewsData(this.ticker),
      this.autocompleteService.fetchTrendsData(this.ticker),
      this.autocompleteService.fetchSentimentData(this.ticker),
      this.autocompleteService.fetchEarningData(this.ticker),
      this.autocompleteService.fetchGraphData2(this.ticker),
    ]).subscribe(([data1, data2, data3, data4, data5, data6, data7, data8, data9]) => {
      this.company_info = data1;
      this.stock_info = data2;
      this.peer_info = data3;
      this.graph_info = data4;
      this.news_info = data5;
      this.trend_info = data6;
      this.sentiment_info = data7;
      this.earning_info = data8;
      this.graph_info2 = data9;

      if (this.company_info[0].ticker === undefined) {
        this.showInvalidAlert = false;
        this.isContentLoading = false;
        this.showBaseInfo = false;
        this.showInvalidAlert = true;
          // setTimeout(() => {
          //   this.showInvalidAlert = false;
          // }, 3000);
        return;
      }

      if (this.IsMarketOpen) {
        this.autocompleteService.fetchCompanyData(this.ticker)
      }
      this.checkWatchlist(this.ticker);
      this.router.navigate(['/search', searchTerm]);
      this.searchInput.nativeElement.blur();
      this.inputValue = 0;
    });

  }

  selectSuggestion(suggestion: any) {
    this.searchQuery.setValue(suggestion.displaySymbol);
    this.suggestions = [];
    this.onSearch(this.searchQuery.value)
  }

  getColorForStock(info: any): string {
    if (info.d < 0) {
      this.graphColor = 'red'
      this.caretStyle = "fa-solid fa-caret-down";
      return 'red'
    }
    else if (info.d < 0) {
      this.graphColor = 'black'
      this.caretStyle = "";
      return 'black'
    }
    else {
      this.graphColor = 'green'
      this.caretStyle = "fa-solid fa-caret-up";
      return 'green'
    }
  }

  correctDate(epoch: number): string {
      const date = new Date(epoch * 1000);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'America/Los_Angeles'
      };

      let formattedDate = date.toLocaleString('en-US', options);
      formattedDate = formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$3-$1-$2');
      
      return formattedDate;
  }

  // The following code was adapted from a solution provided by OpenAI's Assistant.
  // stockMarketStatus(epoch: number): string {
  //   const pstDate = new Date(this.correctDate(epoch));
  //   const dayOfWeek = pstDate.getDay();
  //   const hour = pstDate.getHours();
  //   const minute = pstDate.getMinutes();

  //   if (dayOfWeek === 0 || dayOfWeek === 6) {
  //     const lastFridayEpoch = epoch - ((dayOfWeek === 0 ? 2 : 1) + (dayOfWeek === 6 ? 1 : 0)) * 24 * 60 * 60 * 1000;
  //     this.IsMarketOpen = false;
  //     return `Market Closed on ${this.correctDate(lastFridayEpoch).split(' ')[0]} 13:00:00`;
  //   }
  //   const isOpen = hour === 6 && minute >= 30 || hour > 6 && hour < 13;

  //   if (isOpen) {
  //     this.IsMarketOpen = true;
  //     return "Market is Open";
  //   } else {
  //     if (hour >= 13) {
  //       this.IsMarketOpen = false;
  //       return `Market Closed on ${this.correctDate(epoch).split(' ')[0]} 13:00:00`;
  //     }
  //     else {
  //       if (dayOfWeek === 1) {
  //         const lastFridayEpoch = epoch - 3 * 24 * 60 * 60 * 1000;
  //         this.IsMarketOpen = false;
  //         return `Market Closed on ${this.correctDate(lastFridayEpoch).split(' ')[0]} 13:00:00`;
  //       } else {
  //         const previousDayEpoch = epoch - 24 * 60 * 60 * 1000;
  //         this.IsMarketOpen = false;
  //         return `Market Closed on ${this.correctDate(previousDayEpoch).split(' ')[0]} 13:00:00`;
  //       }
  //     }
  //   }
  // }

    
  // The following code was adapted from a solution provided by OpenAI's Assistant.
  stockMarketStatus(epoch: number): string {
    const pstDate = new Date(this.correctDate(epoch));
    const dayOfWeek = pstDate.getDay();
    const hour = pstDate.getHours();
    const minute = pstDate.getMinutes();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const lastFridayEpoch = epoch - ((dayOfWeek === 0 ? 2 : 1) + (dayOfWeek === 6 ? 1 : 0)) * 24 * 60 * 60 * 1000;
      this.IsMarketOpen = false;
      return `Market Closed on ${this.correctDate(epoch)}`;
    }
    const isOpen = hour === 6 && minute >= 30 || hour > 6 && hour < 13;

    if (isOpen) {
      this.IsMarketOpen = true;
      return "Market is Open";
    } else {
      if (hour >= 13) {
        this.IsMarketOpen = false;
        return `Market Closed on ${this.correctDate(epoch)}`;
      }
      else {
        if (dayOfWeek === 1) {
          const lastFridayEpoch = epoch - 3 * 24 * 60 * 60 * 1000;
          this.IsMarketOpen = false;
          return `Market Closed on ${this.correctDate(epoch)}`;
        } else {
          const previousDayEpoch = epoch - 24 * 60 * 60 * 1000;
          this.IsMarketOpen = false;
          return `Market Closed on ${this.correctDate(epoch)}`;
        }
      }
    }
  }

  getMarketColor(statusMessage: string): string {
    return statusMessage.startsWith("Market is Open") ? "green" : "red";
  }

  setActiveMenuItem(componentName: string): void {
    this.activeMenuItem = componentName;
  }

  ToggleWatchlist(ticker: string): void {
    if (this.watchlistToggle == false) {
      this.watchlistToggle = true;
      this.watchlistColor$.next({'color': '#ffd43b'});
      this.watchlistStyle$.next('fa-solid fa-star fa-xl');

      this.showAddAlert = true;
      setTimeout(() => {
        this.showAddAlert = false;
      }, 3000);
      this.autocompleteService.addToWatchlist(ticker).subscribe(data => {
        this.watchlist_info = data;
      });
    }
    else {
      this.watchlistToggle = false;
      this.watchlistColor$.next({'color': 'black'});
      this.watchlistStyle$.next('fa-regular fa-star fa-xl');
      this.showRemoveAlert = true;
      setTimeout(() => {
        this.showRemoveAlert = false;
      }, 3000);
      this.autocompleteService.removeFromWatchlist(ticker).subscribe(data => {
        this.watchlist_info = data;
      });
    }
  }

  checkWatchlist(ticker: string) {
    this.autocompleteService.checkWatchlist(ticker).subscribe(data => {
      this.watchlist_check_info = data;
      this.watchlistToggle = (this.watchlist_check_info.length != 0 ? true : false);
      this.watchlistColor$.next(this.watchlist_check_info.length != 0 ? {'color': '#ffd43b'} : {'color': 'black'});
      this.watchlistStyle$.next(this.watchlist_check_info.length != 0 ? 'fa-solid fa-star fa-xl' : 'fa-regular fa-star fa-xl');
      this.checkSellButton(ticker);
    });
  }

  checkSellButton (ticker: string) {
    this.autocompleteService.checkPortfolio(ticker).subscribe(data => {
      this.portfolio_check_info = data;
      this.canSell$.next(this.portfolio_check_info.length != 0 ? true : false);
      this.isContentLoading = false;
      this.showBaseInfo = true;
    });
  }

  buyModalDeets () {
    this.currentPrice = this.stock_info[0].c;
    this.currentPrice = parseFloat(this.currentPrice.toFixed(2));

    this.autocompleteService.getWallet().subscribe(data => {
      this.wallet_info = data;
      for (let i = 0; i < this.wallet_info.length; i++) {
        this.moneyInWallet = this.wallet_info[i].total;
      }
      const modalBuy = this.modalService.open(BuymodalComponent);
      modalBuy.componentInstance.portfolio_info = this.portfolio_info;
      modalBuy.componentInstance.ticker = this.company_info[0].ticker;
      modalBuy.componentInstance.moneyInWallet = this.moneyInWallet;
      modalBuy.componentInstance.currentPrice = this.currentPrice;
      modalBuy.result.then(
        (result) => {
          this.canSell$.next(result);
          this.showPAddAlert = true;
          setTimeout(() => {
            this.showPAddAlert = false;
          }, 3000);
          this.refreshPortfolio();
        }
      );
    });
  }

  sellModalDeets () {
    this.currentPrice = this.stock_info[0].c;
    this.currentPrice = parseFloat(this.currentPrice.toFixed(2));

    this.autocompleteService.getWallet().subscribe(data => {
      this.wallet_info = data;
      for (let i = 0; i < this.wallet_info.length; i++) {
        this.moneyInWallet = this.wallet_info[i].total;
      }
      const modalSell = this.modalService.open(SellmodalComponent);
      modalSell.componentInstance.portfolio_info = this.portfolio_info;
      modalSell.componentInstance.ticker = this.company_info[0].ticker;
      modalSell.componentInstance.moneyInWallet = this.moneyInWallet;
      modalSell.componentInstance.currentPrice = this.currentPrice;
      modalSell.result.then(
        (result) => {
          this.canSell$.next(result);
          this.showPRemoveAlert = true;
          setTimeout(() => {
            this.showPRemoveAlert = false;
          }, 3000);
          this.refreshPortfolio();
        }
      );
    });
  }

  refreshPortfolio() {
    this.autocompleteService.getPortfolio().subscribe(data => {
      this.portfolio_info = data;
    });
  }
}
