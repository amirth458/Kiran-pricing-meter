import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartInformationComponent } from './part-information.component';

describe('PartInformationComponent', () => {
  let component: PartInformationComponent;
  let fixture: ComponentFixture<PartInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
