import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsmodalComponent } from './newsmodal.component';

describe('NewsmodalComponent', () => {
  let component: NewsmodalComponent;
  let fixture: ComponentFixture<NewsmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsmodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
