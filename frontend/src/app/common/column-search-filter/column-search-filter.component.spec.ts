import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSearchFilterComponent } from './column-search-filter.component';

describe('ColumnSearchFilterComponent', () => {
  let component: ColumnSearchFilterComponent;
  let fixture: ComponentFixture<ColumnSearchFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnSearchFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
