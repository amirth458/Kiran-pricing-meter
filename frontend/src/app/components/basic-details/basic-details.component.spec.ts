import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDetailsComponent } from './basic-details.component';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BasicDetailsComponent', () => {
  let component: BasicDetailsComponent;
  let fixture: ComponentFixture<BasicDetailsComponent>;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BasicDetailsComponent],
      imports: [FormsModule, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDetailsComponent);
    component = fixture.componentInstance;
    component.detailForm = formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      vendorType: [null, Validators.required],
      vendorIndustry: [null],
      city: [null, Validators.required],
      state: [null, Validators.required],
      country: [null, Validators.required],
      street1: [null, Validators.required],
      street2: [null, Validators.required],
      zipCode: [null, [Validators.required, Validators.pattern(/^[0-9\s]{5}$/)]],
      confidentiality: null,
      vendorCertificates: null
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
