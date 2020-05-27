import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdexProjectComponent } from './prodex-project.component';

describe('ProdexProjectComponent', () => {
  let component: ProdexProjectComponent;
  let fixture: ComponentFixture<ProdexProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProdexProjectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdexProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
