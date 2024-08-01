import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-newsmodal',
  standalone: true,
  imports: [],
  templateUrl: './newsmodal.component.html',
  styleUrl: './newsmodal.component.css'
})
export class NewsmodalComponent {
  @Input() info: any;
  dateFormatted: string = '';

  constructor(public modal: NgbActiveModal) {}

  ngOnInit() {
    if (this.info && this.info.datetime) {
      this.epochToDate(this.info.datetime);
    }
  }

  epochToDate(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    };
    this.dateFormatted = date.toLocaleDateString('en-US', options);
  }

  getUrlX() {
    const text = encodeURIComponent(this.info.headline + ' ' + this.info.url);
    return `https://twitter.com/intent/tweet?text=${text}`;
  }

  getUrlFb(): string {
    const urlToShare = encodeURIComponent(this.info.url);
    return `https://www.facebook.com/sharer/sharer.php?u=${urlToShare}`;
}

}
