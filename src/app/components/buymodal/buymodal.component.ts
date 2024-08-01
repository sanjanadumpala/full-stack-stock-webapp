import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteService } from '../../services/autocomplete.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buymodal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './buymodal.component.html',
  styleUrl: './buymodal.component.css'
})

export class BuymodalComponent {
  @Input() portfolio_info: any;
  @Input() ticker: any;
  @Input() moneyInWallet: any;
  @Input() currentPrice: any;
  ogMoneyInWallet: string = '';
  inputValue: number = 0;
  wallet_info: any[] = [];
  found: number = -1;

  constructor(
    public modal: NgbActiveModal,
    private autocompleteService: AutocompleteService, 
    ) {

  }

  ngOnInit() {
    if (this.ticker && this.moneyInWallet && this.currentPrice) {
      this.ogMoneyInWallet = this.moneyInWallet;
      for (let i = 0; i < this.portfolio_info.length; i++) {
        if (this.portfolio_info[i].ticker === this.ticker) {
          this.found = i;
        }
      }
    }
  }

  totalMoney () {
    return this.currentPrice * this.inputValue;
  }

  enoughMoney () {
    if (+this.ogMoneyInWallet < 1) {
      return true;
    }
    return Number(this.ogMoneyInWallet) < this.totalMoney();
  }

  addToPortfolio (ticker: string) {
    if (this.found === -1) {
      let newQuantity = this.inputValue;
      let newTotalCost = this.totalMoney();
      newTotalCost = parseFloat(newTotalCost.toFixed(2));
      this.autocompleteService.addToPortfolio(ticker, String(newQuantity), String(newTotalCost)).subscribe(data => {
        this.portfolio_info = data;
        this.found = -1;
        this.sendBuyResult()
      });
    }
    else {
      let newQuantity = +this.portfolio_info[this.found].stocks + +this.inputValue;
      let newTotalCost = +this.portfolio_info[this.found].totalcost + +this.totalMoney();
      newTotalCost = parseFloat(newTotalCost.toFixed(2));
      this.autocompleteService.updatePortfolio(ticker, String(newQuantity), String(newTotalCost)).subscribe(data => {
        this.portfolio_info = data;
        this.found = -1;
        this.sendBuyResult()
      });
    }
  }

  sendBuyResult() {
    let canSell = true;
    let temp = Number(this.moneyInWallet) - Number(this.totalMoney());
    temp = parseFloat(temp.toFixed(2));
    this.moneyInWallet = String(temp);  
    this.autocompleteService.setWallet(this.moneyInWallet).subscribe(data => {
      this.wallet_info = data;
      this.modal.close(canSell);
    });
  }

}
