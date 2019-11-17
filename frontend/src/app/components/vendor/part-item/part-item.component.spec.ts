import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartItemComponent } from './part-item.component';

describe('PartItemComponent', () => {
  let component: PartItemComponent;
  let fixture: ComponentFixture<PartItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
