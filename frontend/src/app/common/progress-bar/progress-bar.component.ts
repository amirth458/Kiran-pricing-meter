import { Component, OnInit, Input } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  @Input('text') text: string;
  @Input('percent') percent: number;

  constructor() {}
  ngOnInit() {}
}
