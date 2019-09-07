import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProcessProfileComponent } from './post-process-profile.component';
import { ColumnSearchFilterComponent } from 'src/app/common/column-search-filter/column-search-filter.component';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Router } from '@angular/router';

describe('PostProcessProfileComponent', () => {
  let component: PostProcessProfileComponent;
  let fixture: ComponentFixture<PostProcessProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostProcessProfileComponent, ColumnSearchFilterComponent],
      imports: [FormsModule,
        AgGridModule.withComponents([
        ]),
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/profile/basic'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostProcessProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
