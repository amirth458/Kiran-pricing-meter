import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProcessPricingItemComponent } from './post-process-pricing-item.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('PostProcessPricingItemComponent', () => {
  let component: PostProcessPricingItemComponent;
  let fixture: ComponentFixture<PostProcessPricingItemComponent>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostProcessPricingItemComponent],
      imports: [FormsModule],
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
    fixture = TestBed.createComponent(PostProcessPricingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
