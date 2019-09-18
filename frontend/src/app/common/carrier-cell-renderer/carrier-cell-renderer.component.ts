import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-carrier-cell-renderer',
  templateUrl: './carrier-cell-renderer.component.html',
  styleUrls: ['./carrier-cell-renderer.component.css']
})
export class CarrierCellRendererComponent implements ICellRendererAngularComp {

  params;

  constructor() { }

  agInit(params): void {
    this.params = params;
    if (!params) {
      throw new Error('Required `param` not recieved');
    }
    console.log(this.params);
  }

  refresh(): boolean {
    return false;
  }

}
