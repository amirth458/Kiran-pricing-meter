import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartQuoteComponent } from './part-quote.component';

describe('PartQuoteComponent', () => {
  let component: PartQuoteComponent;
  let fixture: ComponentFixture<PartQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartQuoteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
