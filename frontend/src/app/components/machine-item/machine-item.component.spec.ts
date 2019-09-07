import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineItemComponent } from './machine-item.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';

describe('MachineItemComponent', () => {
  let component: MachineItemComponent;
  let fixture: ComponentFixture<MachineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MachineItemComponent, ActionCellRendererComponent],
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
    fixture = TestBed.createComponent(MachineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
