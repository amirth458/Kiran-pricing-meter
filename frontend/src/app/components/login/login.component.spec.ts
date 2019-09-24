import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityItemComponent } from './facility-item.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('FacilityItemComponent', () => {
  let component: FacilityItemComponent;
  let fixture: ComponentFixture<FacilityItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacilityItemComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/profile/facilities/add'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
