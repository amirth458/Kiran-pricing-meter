import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { ChatComponent } from './chat/chat.component';
import { PlainChatComponent } from './plain-chat/plain-chat.component';
import { MessageViewerComponent } from './message-viewer/message-viewer.component';

import { ClosePopoverOnClickOutsideDirective } from './pop-over-close/close-popover-on-click-outside.directive';
import { UnReadCountPipe } from '../../pipes/un-read-count.pipe';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    ChatComponent,
    PlainChatComponent,
    MessageViewerComponent,
    ClosePopoverOnClickOutsideDirective,
    UnReadCountPipe
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule, PerfectScrollbarModule],
  providers: [
    UnReadCountPipe,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [
    ChatComponent,
    PlainChatComponent,
    MessageViewerComponent,

    ClosePopoverOnClickOutsideDirective,
    UnReadCountPipe
  ]
})
export class ChatModule {}
