import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingItemComponent } from './shipping-item.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('ShippingItemComponent', () => {
  let component: ShippingItemComponent;
  let fixture: ComponentFixture<ShippingItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingItemComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: Router, useValue: {
            url: '/profile/shipping/1'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
