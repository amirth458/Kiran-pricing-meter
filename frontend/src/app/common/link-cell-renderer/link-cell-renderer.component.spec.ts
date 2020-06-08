import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCellRendererComponent } from './link-cell-renderer.component';

describe('LinkCellRendererComponent', () => {
  let component: LinkCellRendererComponent;
  let fixture: ComponentFixture<LinkCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinkCellRendererComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
