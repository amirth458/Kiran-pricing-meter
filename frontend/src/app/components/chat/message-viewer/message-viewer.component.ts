import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { MessageNote } from '../../../model/chat.model';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-message-viewer',
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.css']
})
export class MessageViewerComponent implements OnInit, AfterViewInit {
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  @Input() value: MessageNote[];
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  user: any;
  public config: PerfectScrollbarConfigInterface = {};

  constructor(public userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.getUserInfo();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  public scrollToBottom(): void {
    if (this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
    }
  }
}
