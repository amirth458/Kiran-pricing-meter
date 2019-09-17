import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesComponent } from './preferences.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SubSectionMenuComponent } from 'src/app/common/sub-section-menu/sub-section-menu.component';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreferencesComponent, SubSectionMenuComponent, ActionCellRendererComponent],
      imports: [FormsModule, HttpClientTestingModule, ReactiveFormsModule, AgGridModule.withComponents([
        ActionCellRendererComponent,
      ])],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({
      id: [null],
      coreCompetence: [''],
      adjacentGrowth: [''],
      rfqExclusionCondition: [''],
      clientExclusionCondition: [''],
      vendorId: [null]
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
