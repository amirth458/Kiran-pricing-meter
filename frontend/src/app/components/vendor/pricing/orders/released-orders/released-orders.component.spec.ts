import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasedOrdersComponent } from './released-orders.component';

describe('ReleasedOrdersComponent', () => {
  let component: ReleasedOrdersComponent;
  let fixture: ComponentFixture<ReleasedOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleasedOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
