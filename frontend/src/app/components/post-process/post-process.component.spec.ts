import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProcessComponent } from './post-process.component';
import { ActionBarComponent } from 'src/app/common/action-bar/action-bar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PostProcessComponent', () => {
  let component: PostProcessComponent;
  let fixture: ComponentFixture<PostProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostProcessComponent, ActionBarComponent],
      imports: [RouterTestingModule]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
