import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPricingItemComponent } from './process-pricing-item.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('ProcessPricingItemComponent', () => {
  let component: ProcessPricingItemComponent;
  let fixture: ComponentFixture<ProcessPricingItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessPricingItemComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: Router, useValue: {
            url: 'profile/processes/pricing/add'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessPricingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
