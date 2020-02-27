import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqContainerComponent } from './rfq-container.component';

describe('RfqContainerComponent', () => {
  let component: RfqContainerComponent;
  let fixture: ComponentFixture<RfqContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RfqContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
