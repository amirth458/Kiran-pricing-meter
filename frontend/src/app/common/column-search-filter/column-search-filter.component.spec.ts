import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSearchFilterComponent } from './column-search-filter.component';
import { FormsModule } from '@angular/forms';

describe('ColumnSearchFilterComponent', () => {
  let component: ColumnSearchFilterComponent;
  let fixture: ComponentFixture<ColumnSearchFilterComponent>;

  const searchColumns = [
    {
      name: 'Equipment',
      checked: false,
      query: {
        type: null,
        filter: null
      }
    },
    {
      name: 'Process Profile Name',
      checked: false,
      query: {
        type: null,
        filter: null
      }
    },
    {
      name: 'Layer Height',
      checked: false,
      query: {
        type: null,
        filter: null
      }
    },
    {
      name: 'Infill',
      checked: false,
      query: {
        type: null,
        filter: null
      }
    },
    {
      name: 'Tolerance Base',
      checked: false,
      query: {
        type: null,
        filter: null
      }
    }
  ];

  const filterColumns = [
    {
      name: 'Equipment',
      checked: false
    },
    {
      name: 'Process Profile Name',
      checked: false
    },
    {
      name: 'Layer Height',
      checked: false
    },
    {
      name: 'Infill',
      checked: false
    },
    {
      name: 'Tolerance Base',
      checked: false
    }
  ];
  const options: Array<string> = [
    'is',
    `isn't`,
    `doesn't contain`,
    'starts with',
    'ends with',
    'is empty',
    'is not empty'
  ];
  const type: Array<string> = ['search', 'filter'];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnSearchFilterComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnSearchFilterComponent);
    component = fixture.componentInstance;

    component.searchColumns = searchColumns;
    component.filterColumns = filterColumns;
    component.options = options;
    component.type = type;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
