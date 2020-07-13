import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessProfileItemComponent } from './process-profile-item.component';

describe('ProcessProfileItemComponent', () => {
  let component: ProcessProfileItemComponent;
  let fixture: ComponentFixture<ProcessProfileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessProfileItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessProfileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
