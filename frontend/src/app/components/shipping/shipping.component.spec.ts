import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingComponent } from './shipping.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { CarrierCellRendererComponent } from 'src/app/common/carrier-cell-renderer/carrier-cell-renderer.component';

describe('ShippingComponent', () => {
  let component: ShippingComponent;
  let fixture: ComponentFixture<ShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingComponent, CarrierCellRendererComponent],
      imports: [FormsModule,
        AgGridModule.withComponents([
          CarrierCellRendererComponent
        ]),
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/profile/shipping'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
