import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-model-detail-view',
  templateUrl: './model-detail-view.component.html',
  styleUrls: ['./model-detail-view.component.css']
})
export class ModelDetailViewComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.close.emit();
  }
}
