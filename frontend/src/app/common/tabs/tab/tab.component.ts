import {
  Component,
  ContentChildren,
  EventEmitter,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import { TabItemComponent } from '../tab-item/tab-item.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  @ContentChildren(TabItemComponent) tabs: QueryList<TabItemComponent>;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  selectTab(tab: any) {
    this.tabs.toArray().forEach(tab => tab.active = false);
    tab.active = true;
    this.valueChange.emit({ value : tab.value });
  }

}
