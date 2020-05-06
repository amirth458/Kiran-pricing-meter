import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPartsInformationComponent } from './multi-parts-information.component';

describe('MultiPartsInformationComponent', () => {
  let component: MultiPartsInformationComponent;
  let fixture: ComponentFixture<MultiPartsInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiPartsInformationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiPartsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
