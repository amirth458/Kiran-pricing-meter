import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastOrderDetailsComponent } from './past-order-details.component';

describe('PastOrderDetailsComponent', () => {
  let component: PastOrderDetailsComponent;
  let fixture: ComponentFixture<PastOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastOrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
