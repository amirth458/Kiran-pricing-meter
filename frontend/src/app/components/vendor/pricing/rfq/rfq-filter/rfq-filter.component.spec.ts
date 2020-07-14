import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqFilterComponent } from './rfq-filter.component';

describe('RfqFilterComponent', () => {
  let component: RfqFilterComponent;
  let fixture: ComponentFixture<RfqFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RfqFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
