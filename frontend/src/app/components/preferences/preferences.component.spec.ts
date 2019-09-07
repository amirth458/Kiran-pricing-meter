import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesComponent } from './preferences.component';
import { FormsModule } from '@angular/forms';
import { SubSectionMenuComponent } from 'src/app/common/sub-section-menu/sub-section-menu.component';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { AgGridModule } from 'ag-grid-angular';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreferencesComponent, SubSectionMenuComponent, ActionCellRendererComponent],
      imports: [FormsModule, AgGridModule.withComponents([
        ActionCellRendererComponent,
      ]),]
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
