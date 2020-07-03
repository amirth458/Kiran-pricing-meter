import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdPartComponent } from './prod-part.component';

describe('ProdPartComponent', () => {
  let component: ProdPartComponent;
  let fixture: ComponentFixture<ProdPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProdPartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
