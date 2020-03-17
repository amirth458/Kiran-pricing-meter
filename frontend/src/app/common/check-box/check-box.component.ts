import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.css']
})
export class CheckBoxComponent implements OnInit {
  @Input()
  label: string;
  @Input()
  checked: boolean;
  @Input()
  disabled: boolean;
  @Output()
  checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit() {}
}
