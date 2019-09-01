import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityItemComponent } from './facility-item.component';

describe('FacilityItemComponent', () => {
  let component: FacilityItemComponent;
  let fixture: ComponentFixture<FacilityItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
