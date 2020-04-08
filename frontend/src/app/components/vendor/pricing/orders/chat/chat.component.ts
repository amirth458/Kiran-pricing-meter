import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Chat, ChatTypeEnum } from '../../../../../model/chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() id: number;
  @Input() type: ChatTypeEnum;
  @Input() value: Chat;

  @Output() valueChange: EventEmitter<Chat> = new EventEmitter<Chat>();

  noteFormGroup: FormGroup = this.fb.group({
    note: ['', Validators.required]
  });
  loadingNote: boolean;

  constructor(public fb: FormBuilder) {}

  ngOnInit() {}

  openChat($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  sendNote($event) {}

  addNote() {}

  onScroll() {}
}
