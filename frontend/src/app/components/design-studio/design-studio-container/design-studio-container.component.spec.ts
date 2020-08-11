import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignStudioContainerComponent } from './design-studio-container.component';

describe('DesignStudioContainerComponent', () => {
  let component: DesignStudioContainerComponent;
  let fixture: ComponentFixture<DesignStudioContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesignStudioContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignStudioContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
