import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProcessProfileItemComponent } from './post-process-profile-item.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ColumnSearchFilterComponent } from 'src/app/common/column-search-filter/column-search-filter.component';

describe('PostProcessProfileItemComponent', () => {
  let component: PostProcessProfileItemComponent;
  let fixture: ComponentFixture<PostProcessProfileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostProcessProfileItemComponent, ColumnSearchFilterComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/profile/facilities/add'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostProcessProfileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
