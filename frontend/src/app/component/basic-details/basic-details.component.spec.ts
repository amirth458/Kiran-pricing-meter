import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDetailsComponent } from './basic-details.component';
import { FormsModule } from '@angular/forms';

describe('BasicDetailsComponent', () => {
  let component: BasicDetailsComponent;
  let fixture: ComponentFixture<BasicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BasicDetailsComponent],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
