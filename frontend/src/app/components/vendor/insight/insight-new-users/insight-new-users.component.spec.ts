import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightNewUsersComponent } from './insight-new-users.component';

describe('InsightNewUsersComponent', () => {
  let component: InsightNewUsersComponent;
  let fixture: ComponentFixture<InsightNewUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightNewUsersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightNewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
