import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedRfqComponent } from './archived-rfq.component';

describe('ArchivedRfqComponent', () => {
  let component: ArchivedRfqComponent;
  let fixture: ComponentFixture<ArchivedRfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
