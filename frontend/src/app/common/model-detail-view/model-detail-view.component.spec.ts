import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDetailViewComponent } from './model-detail-view.component';

describe('ModelDetailViewComponent', () => {
  let component: ModelDetailViewComponent;
  let fixture: ComponentFixture<ModelDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
