import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefFileComponent } from './ref-file.component';

describe('RefFileComponent', () => {
  let component: RefFileComponent;
  let fixture: ComponentFixture<RefFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RefFileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
