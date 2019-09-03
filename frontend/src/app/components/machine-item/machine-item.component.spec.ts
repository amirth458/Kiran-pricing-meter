import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineItemComponent } from './machine-item.component';

describe('MachineItemComponent', () => {
  let component: MachineItemComponent;
  let fixture: ComponentFixture<MachineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineItemComponent ]
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
