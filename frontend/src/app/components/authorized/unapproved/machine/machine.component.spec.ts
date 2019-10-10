import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVendorDetailsMachineComponent } from './vendor-details-machine.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';

describe('MachineItemComponent', () => {
  let component: AdminVendorDetailsMachineComponent;
  let fixture: ComponentFixture<AdminVendorDetailsMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminVendorDetailsMachineComponent, ActionCellRendererComponent],
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
    fixture = TestBed.createComponent(AdminVendorDetailsMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
