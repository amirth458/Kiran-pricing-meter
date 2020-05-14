import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightBidprocessComponent } from './insight-bidprocess.component';

describe('InsightBidprocessComponent', () => {
  let component: InsightBidprocessComponent;
  let fixture: ComponentFixture<InsightBidprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightBidprocessComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightBidprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
