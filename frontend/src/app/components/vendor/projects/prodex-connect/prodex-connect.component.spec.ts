import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdexConnectComponent } from './prodex-connect.component';

describe('ProdexConnectComponent', () => {
  let component: ProdexConnectComponent;
  let fixture: ComponentFixture<ProdexConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProdexConnectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdexConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
