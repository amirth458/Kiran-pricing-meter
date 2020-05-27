import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css']
})
export class ChipComponent implements OnInit {
  @Input() label = '';
  @Input() index;
  @Output() removeItem: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onRemoveItem(e) {
    e.stopPropagation();
    this.removeItem.emit(this.index);
  }
}
