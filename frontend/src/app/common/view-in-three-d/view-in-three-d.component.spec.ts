import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInThreeDComponent } from './view-in-three-d.component';

describe('ViewInThreeDComponent', () => {
  let component: ViewInThreeDComponent;
  let fixture: ComponentFixture<ViewInThreeDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewInThreeDComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInThreeDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
