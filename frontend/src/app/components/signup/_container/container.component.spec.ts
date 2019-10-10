import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorComponent } from './vendor.component';
import { ActionBarComponent } from 'src/app/common/action-bar/action-bar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('VendorComponent', () => {
  let component: VendorComponent;
  let fixture: ComponentFixture<VendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VendorComponent, ActionBarComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
