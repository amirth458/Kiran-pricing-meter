import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipCellRendererComponent } from './tooltip-cell-renderer.component';

describe('TooltipCellRendererComponent', () => {
  let component: TooltipCellRendererComponent;
  let fixture: ComponentFixture<TooltipCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
