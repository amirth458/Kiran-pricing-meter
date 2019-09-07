import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionBarComponent } from './action-bar.component';
import { Router } from '@angular/router';

describe('ActionBarComponent', () => {
  let component: ActionBarComponent;
  let fixture: ComponentFixture<ActionBarComponent>;


  const menus: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{ name: string, route: string }>
  }> = [
      {
        name: 'Basic Details',
        tooltipMessage: 'At vero eos et accusamus et',
        route: 'basics',
        actions: []
      },
      {
        name: 'Facilities',
        tooltipMessage: 'At vero eos et accusamus et',
        route: 'facilities',
        actions: [{ name: 'Add Facility', route: 'add' }]
      },
      {
        name: 'Preferences',
        tooltipMessage: 'At vero eos et accusamus et',
        route: 'preferences',
        actions: []
      },
      {
        name: 'Machines',
        tooltipMessage: 'At vero eos et accusamus et',
        route: 'machines',
        actions: [{ name: 'Add Machine', route: 'add' }]
      },
      {
        name: 'Shipping',
        tooltipMessage: 'At vero eos et accusamus et',
        route: 'shipping',
        actions: [{ name: 'Add Carrier', route: 'add' }]
      }
    ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionBarComponent],
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
    fixture = TestBed.createComponent(ActionBarComponent);
    component = fixture.componentInstance;

    component.menus = menus;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
