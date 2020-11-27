import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../../Shared/AppBaseComponent";

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent extends AppComponentBase implements OnInit {
  public displayedColumns: string[];
  public DataSources: any[];
  public propertyReview: any[];
  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
    this.displayedColumns = ['id', 'clientName', 'address', 'createdDate', 'status'];
    this.DataSources = [{ id: 1, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'active' },
      { id: 2, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'nonactive' },
      { id: 3, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'inactive' },
      { id: 4, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'nonactive' },
      { id: 5, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'nonactive' },
      { id: 6, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'inactive' },
      { id: 7, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'active' },
      { id: 8, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'inactive' },
      { id: 9, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'active' },
      { id: 10, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'inactive' },
      { id: 11, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'active' },
      { id: 12, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'active' },
      { id: 13, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'inactive' },
      { id: 14, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'nonactive' },
      { id: 15, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'active' },
      { id: 16, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'inactive' },
      { id: 17, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'nonactive' },
      { id: 18, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'active' },
      { id: 19, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'inactive' },
      { id: 20, clientName: 'Subhod noah', address: '1316 E 22ND st, Los Angles', createdDate: 'Jul 30, 2020', status: 'inactive' },
      ];
    this.propertyReview = [
      {value: 1 },
      {value: 2} ,
      {value: 3,},
      {value: 4},
      {value: 5},
      {value: 6},
      {value: 7 },
      {value: 8,  key: 'active'},
      {value: 9},
    ]
  }


}
