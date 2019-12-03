import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullfillmentSettingsComponent } from './fullfillment-settings.component';

describe('FullfillmentSettingsComponent', () => {
  let component: FullfillmentSettingsComponent;
  let fixture: ComponentFixture<FullfillmentSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullfillmentSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullfillmentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
