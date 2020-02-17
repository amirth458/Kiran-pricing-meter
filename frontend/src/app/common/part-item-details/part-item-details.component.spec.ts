import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartItemDetailsComponent } from './part-item-details.component';

describe('PartItemDetailsComponent', () => {
  let component: PartItemDetailsComponent;
  let fixture: ComponentFixture<PartItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
