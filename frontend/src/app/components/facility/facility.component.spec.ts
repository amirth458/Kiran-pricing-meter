import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityComponent } from './facility.component';
import { ColumnSearchFilterComponent } from 'src/app/common/column-search-filter/column-search-filter.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('FacilityComponent', () => {
  let component: FacilityComponent;
  let fixture: ComponentFixture<FacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacilityComponent, ColumnSearchFilterComponent],
      imports: [
        AgGridModule.withComponents([]),
        FormsModule
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/profile/facilities'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
