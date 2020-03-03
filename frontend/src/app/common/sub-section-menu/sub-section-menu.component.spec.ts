import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSectionMenuComponent } from './sub-section-menu.component';
import { Router } from '@angular/router';

describe('SubSectionMenuComponent', () => {
  let component: SubSectionMenuComponent;
  let fixture: ComponentFixture<SubSectionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubSectionMenuComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/profile/basic'
          }
        }
      ]
    }).compileComponents();
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
