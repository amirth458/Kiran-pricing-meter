import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDropdownFilterComponent } from './status-dropdown-filter.component';

describe('StatusDropdownFilterComponent', () => {
  let component: StatusDropdownFilterComponent;
  let fixture: ComponentFixture<StatusDropdownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusDropdownFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusDropdownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
