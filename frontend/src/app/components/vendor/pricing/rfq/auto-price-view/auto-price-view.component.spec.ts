import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoPriceViewComponent } from './auto-price-view.component';

describe('AutoPriceViewComponent', () => {
  let component: AutoPriceViewComponent;
  let fixture: ComponentFixture<AutoPriceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoPriceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoPriceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
