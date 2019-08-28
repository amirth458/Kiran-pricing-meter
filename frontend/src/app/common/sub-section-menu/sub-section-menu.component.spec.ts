import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSectionMenuComponent } from './sub-section-menu.component';

describe('SubSectionMenuComponent', () => {
  let component: SubSectionMenuComponent;
  let fixture: ComponentFixture<SubSectionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSectionMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSectionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
