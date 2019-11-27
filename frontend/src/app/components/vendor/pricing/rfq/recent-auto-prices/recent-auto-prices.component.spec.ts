import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentAutoPricesComponent } from './recent-auto-prices.component';

describe('RecentAutoPricesComponent', () => {
  let component: RecentAutoPricesComponent;
  let fixture: ComponentFixture<RecentAutoPricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentAutoPricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentAutoPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
