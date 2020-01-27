import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveVendorComponent } from './approve-vendor.component';
import { ColumnSearchFilterComponent } from 'src/app/common/column-search-filter/column-search-filter.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('ApproveVendorComponent', () => {
  let component: ApproveVendorComponent;
  let fixture: ComponentFixture<ApproveVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApproveVendorComponent, ColumnSearchFilterComponent],
      imports: [
        AgGridModule.withComponents([]),
        FormsModule,
        HttpClientModule
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/admin/approve-vendor'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
