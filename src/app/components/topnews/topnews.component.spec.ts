import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopnewsComponent } from './topnews.component';

describe('TopnewsComponent', () => {
  let component: TopnewsComponent;
  let fixture: ComponentFixture<TopnewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopnewsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
