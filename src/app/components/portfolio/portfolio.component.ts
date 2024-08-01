import { PItem } from './../../models/portfolio.model';
import { Component } from '@angular/core';
import { AutocompleteService } from '../../services/autocomplete.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuymodalComponent } from '../buymodal/buymodal.component';
import { SellmodalComponent } from '../sellmodal/sellmodal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {

  portfolio_info: any[] = [];
  company_info: any[] = [];
  stock_info: any[] = [];
  print_info: PItem[] = [];
  wallet_info: any[] = [];
  hasItems: boolean = false;
  moneyInWallet: string = '25000.00';
  inputValue: number = 0;
  ticker: string = '';
  showAddAlert: boolean = false;
  showRemoveAlert: boolean = false;
  currentPurchase: string = '';
  isContentLoading = true;

  constructor(
    private autocompleteService: AutocompleteService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.displayPortfolio();
  }

  displayPortfolio () {
    this.isContentLoading = true;
    this.print_info = [];
    this.autocompleteService.getPortfolio().subscribe(data => {
      this.portfolio_info = data;
      this.autocompleteService.getWallet().subscribe(data => {
        this.wallet_info = data;
        if (this.portfolio_info.length === 0) {
          this.hasItems = false;
        }

        for (let i = 0; i < this.portfolio_info.length; i++) {
          this.hasItems = true;
          let caretstyle: string = '';
          let color: {'color': string};

          forkJoin([
            this.autocompleteService.fetchCompanyData(this.portfolio_info[i].ticker),
            this.autocompleteService.fetchStockData(this.portfolio_info[i].ticker),
            ]).subscribe(([data1, data2]) => {
            this.company_info = data1;
            this.stock_info = data2;
            let tempChange = parseFloat((this.stock_info[0].c).toFixed(2));
            let tempTotalChange = parseFloat((Number(this.portfolio_info[i].totalcost)).toFixed(2));
            let tempStocks = parseFloat(Number(this.portfolio_info[i].stocks).toFixed(2));
            let tempDivide = tempTotalChange / tempStocks;
            let calcChange = tempChange - parseFloat((tempDivide).toFixed(2));
            if (calcChange < 0) {
              caretstyle = "fa-solid fa-caret-down";
              color = {'color': 'red'};
            }
            else if (calcChange > 0) {
              caretstyle = "fa-solid fa-caret-up";
              color = {'color': 'green'};
            }
            else {
              caretstyle = "";
              color = {'color': 'black'};
            }
            const tempPrintInfo: PItem = {
              ticker: this.portfolio_info[i].ticker,
              name: this.company_info[0].name,
              quantity: this.portfolio_info[i].stocks + ".00",
              avgcost: Number(this.portfolio_info[i].totalcost) / Number(this.portfolio_info[i].stocks),
              totalcost: this.portfolio_info[i].totalcost,
              change: this.stock_info[0].c.toFixed(2) - (Number(this.portfolio_info[i].totalcost) / Number(this.portfolio_info[i].stocks)),
              currentprice: this.stock_info[0].c,
              marketvalue: Number(this.portfolio_info[i].stocks) * this.stock_info[0].c,
              caretstyle: caretstyle,
              color: color
            };
            this.print_info.push(tempPrintInfo);
          });
        }
        this.isContentLoading = false;
      });
    });
  }

  buyModalDeets (ticker: string, currentprice: number) {
    currentprice = parseFloat(currentprice.toFixed(2));
    this.autocompleteService.getWallet().subscribe(data => {
      this.wallet_info = data;
      for (let i = 0; i < this.wallet_info.length; i++) {
        this.moneyInWallet = this.wallet_info[i].total;
      }
      const modalBuy = this.modalService.open(BuymodalComponent);
      modalBuy.componentInstance.portfolio_info = this.portfolio_info;
      modalBuy.componentInstance.ticker = ticker;
      modalBuy.componentInstance.moneyInWallet = this.moneyInWallet;
      modalBuy.componentInstance.currentPrice = currentprice;
      modalBuy.result.then(
        (result) => {
          this.currentPurchase = ticker;
          this.showAddAlert = true;
          setTimeout(() => {
            this.showAddAlert = false;
          }, 3000);
          this.displayPortfolio();
        }
      );
    });
  }

  sellModalDeets (ticker: string, currentprice: number) {
    currentprice = parseFloat(currentprice.toFixed(2));
    this.autocompleteService.getWallet().subscribe(data => {
      this.wallet_info = data;
      for (let i = 0; i < this.wallet_info.length; i++) {
        this.moneyInWallet = this.wallet_info[i].total;
      }
      const modalSell = this.modalService.open(SellmodalComponent);
      modalSell.componentInstance.portfolio_info = this.portfolio_info;
      modalSell.componentInstance.ticker = ticker;
      modalSell.componentInstance.moneyInWallet = this.moneyInWallet;
      modalSell.componentInstance.currentPrice = currentprice;
      modalSell.result.then(
        (result) => {
          this.currentPurchase = ticker;
          this.showRemoveAlert = true;
          setTimeout(() => {
            this.showRemoveAlert = false;
          }, 3000);
          this.displayPortfolio();
        }
      );
    });
  }

  onClick (ticker: string) {
    this.router.navigate(['/search', ticker]);
  }

}
