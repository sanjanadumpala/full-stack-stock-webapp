import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsmodalComponent } from '../newsmodal/newsmodal.component';

@Component({
  selector: 'app-topnews',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NewsmodalComponent,
  ],
  templateUrl: './topnews.component.html',
  styleUrl: './topnews.component.css'
})
export class TopnewsComponent {
  @Input() news_info: any;

  constructor(private modalService: NgbModal) {}

  open(info: any, event: MouseEvent) {
    event.preventDefault();
    const modalRef = this.modalService.open(NewsmodalComponent);
    modalRef.componentInstance.info = info;
  }
}
