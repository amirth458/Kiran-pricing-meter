import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPricingComponent } from './process-pricing.component';
import { ColumnSearchFilterComponent } from 'src/app/common/column-search-filter/column-search-filter.component';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Router } from '@angular/router';

describe('ProcessPricingComponent', () => {
  let component: ProcessPricingComponent;
  let fixture: ComponentFixture<ProcessPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessPricingComponent, ColumnSearchFilterComponent],
      imports: [FormsModule,
        AgGridModule.withComponents([
        ])],
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
    fixture = TestBed.createComponent(ProcessPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
