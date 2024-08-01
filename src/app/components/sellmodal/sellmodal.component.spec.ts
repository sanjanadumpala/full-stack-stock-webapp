import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellmodalComponent } from './sellmodal.component';

describe('SellmodalComponent', () => {
  let component: SellmodalComponent;
  let fixture: ComponentFixture<SellmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellmodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
