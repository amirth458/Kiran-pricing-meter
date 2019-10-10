import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCompletedComponent } from './register-completed.component';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BasicDetailsComponent', () => {
  let component: RegisterCompletedComponent;
  let fixture: ComponentFixture<RegisterCompletedComponent>;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterCompletedComponent],
      imports: [FormsModule, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
