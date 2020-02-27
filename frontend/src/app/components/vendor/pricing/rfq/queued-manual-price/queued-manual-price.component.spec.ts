import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuedManualPriceComponent } from './queued-manual-price.component';

describe('QueuedManualPriceComponent', () => {
  let component: QueuedManualPriceComponent;
  let fixture: ComponentFixture<QueuedManualPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QueuedManualPriceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuedManualPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
