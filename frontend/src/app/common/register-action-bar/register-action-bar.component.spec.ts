import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterActionBarComponent } from './register-action-bar.component';
import { Router } from '@angular/router';

describe('ActionBarComponent', () => {
  let component: RegisterActionBarComponent;
  let fixture: ComponentFixture<RegisterActionBarComponent>;


  const menus: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{ name: string, route: string }>
  }> = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterActionBarComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/profile/basic'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterActionBarComponent);
    component = fixture.componentInstance;

    component.menus = menus;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
