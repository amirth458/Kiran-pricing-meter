import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesComponent } from './preferences.component';
import { FormsModule } from '@angular/forms';
import { SubSectionMenuComponent } from 'src/app/common/sub-section-menu/sub-section-menu.component';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreferencesComponent, SubSectionMenuComponent],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
