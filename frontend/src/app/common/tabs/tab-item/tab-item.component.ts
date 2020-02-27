import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.css']
})
export class TabItemComponent {
  @Input('tabTitle') title: string;
  @Input() active = false;
  @Input() value: any;

  constructor() {}
}
