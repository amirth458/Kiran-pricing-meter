import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicRfqComponent } from './basic-rfq.component';

describe('BasicRfqComponent', () => {
  let component: BasicRfqComponent;
  let fixture: ComponentFixture<BasicRfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
