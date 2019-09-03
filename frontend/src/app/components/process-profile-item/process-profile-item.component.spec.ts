import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessProfileItemComponent } from './process-profile-item.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('ProcessProfileItemComponent', () => {
  let component: ProcessProfileItemComponent;
  let fixture: ComponentFixture<ProcessProfileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessProfileItemComponent],
      imports: [FormsModule],
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
    fixture = TestBed.createComponent(ProcessProfileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
