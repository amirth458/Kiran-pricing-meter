import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProcessPricingComponent } from './post-process-pricing.component';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Router } from '@angular/router';

describe('PostProcessPricingComponent', () => {
  let component: PostProcessPricingComponent;
  let fixture: ComponentFixture<PostProcessPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostProcessPricingComponent],
      imports: [FormsModule,
        AgGridModule.withComponents([
        ])],
      providers: [
        {
          provide: Router, useValue: {
            url: 'profile/post-processes/pricing/add'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostProcessPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
