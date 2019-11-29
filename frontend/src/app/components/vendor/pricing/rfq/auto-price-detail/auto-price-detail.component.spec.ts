import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoPriceDetailComponent } from './auto-price-detail.component';

describe('AutoPriceDetailComponent', () => {
  let component: AutoPriceDetailComponent;
  let fixture: ComponentFixture<AutoPriceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoPriceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoPriceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
