import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-new-users',
  templateUrl: './insight-new-users.component.html',
  styleUrls: ['./insight-new-users.component.css']
})
export class InsightNewUsersComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'User ID',
      field: 'user_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'user_id',
      headerTooltip: 'User ID'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
