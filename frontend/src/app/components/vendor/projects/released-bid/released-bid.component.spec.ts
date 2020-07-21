import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasedBidComponent } from './released-bid.component';

describe('ReleasedBidComponent', () => {
  let component: ReleasedBidComponent;
  let fixture: ComponentFixture<ReleasedBidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReleasedBidComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasedBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
