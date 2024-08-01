import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteService } from '../../services/autocomplete.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sellmodal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './sellmodal.component.html',
  styleUrl: './sellmodal.component.css'
})
export class SellmodalComponent {
  @Input() portfolio_info: any;
  @Input() ticker: any;
  @Input() moneyInWallet: any;
  @Input() currentPrice: any;
  inputValue: number = 0;
  ogMoneyInWallet: string = '';
  found: number = -1;
  wallet_info: any[] = [];

  constructor(
    public modal: NgbActiveModal,
    private autocompleteService: AutocompleteService, 
    ) {
  }

  ngOnInit() {
    if (this.ticker && this.moneyInWallet && this.currentPrice && this.portfolio_info) {
      this.ogMoneyInWallet = this.moneyInWallet;
      for (let i = 0; i < this.portfolio_info.length; i++) {
        if (this.portfolio_info[i].ticker === this.ticker) {
          this.found = i;
        }
      }

    }
  }

  enoughStocks () {
    if (this.portfolio_info[this.found].stocks) {
      return Number(this.inputValue) > Number(this.portfolio_info[this.found].stocks);
    }
    else {
      return false
    }
  }

  removeFromPortfolio () {
    if (+this.portfolio_info[this.found].stocks === +this.inputValue) {
      this.autocompleteService.removeFromPortfolio(this.ticker).subscribe(data => {
        this.portfolio_info = data;
        this.found = -1;
        this.sendSellResult(false);

      });
    }
    else {
      let newQuantity = +this.portfolio_info[this.found].stocks - +this.inputValue;
      let newTotalCost = +this.portfolio_info[this.found].totalcost - ((+this.portfolio_info[this.found].totalcost/+this.portfolio_info[this.found].stocks) * +this.inputValue);
      newTotalCost = parseFloat(newTotalCost.toFixed(2));
      this.autocompleteService.updatePortfolio(this.ticker, String(newQuantity), String(newTotalCost)).subscribe(data => {
        this.portfolio_info = data;
        this.found = -1;
        this.sendSellResult(true)
      });
    }
  }

  sendSellResult(canSell: boolean) {
    let temp = Number(this.moneyInWallet) + this.currentPrice*this.inputValue;
    temp = parseFloat(temp.toFixed(2));
    this.moneyInWallet = String(temp);  
    this.autocompleteService.setWallet(this.moneyInWallet).subscribe(data => {
      this.wallet_info = data;
      this.modal.close(canSell);
    });
  }
}
