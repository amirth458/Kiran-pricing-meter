import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubOrderInformationComponent } from './sub-order-information.component';

describe('SubOrderInformationComponent', () => {
  let component: SubOrderInformationComponent;
  let fixture: ComponentFixture<SubOrderInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubOrderInformationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubOrderInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
