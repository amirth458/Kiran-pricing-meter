import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMachineComponent } from './register-machine.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';

describe('MachineItemComponent', () => {
  let component: RegisterMachineComponent;
  let fixture: ComponentFixture<RegisterMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterMachineComponent, ActionCellRendererComponent],
      imports: [
        FormsModule,
        AgGridModule.withComponents([
          ActionCellRendererComponent
        ])
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
    fixture = TestBed.createComponent(RegisterMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
