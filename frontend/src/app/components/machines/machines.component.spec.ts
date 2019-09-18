import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesComponent } from './machines.component';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('MachinesComponent', () => {
  let component: MachinesComponent;
  let fixture: ComponentFixture<MachinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MachinesComponent],
      imports: [FormsModule,
        AgGridModule.withComponents([
        ]),
        HttpClientModule
      ],
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
    fixture = TestBed.createComponent(MachinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
