import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ChatComponent } from '../chat/chat.component';
import { ChatService } from '../../../service/chat.service';
import { ChatTypeEnum } from '../../../model/chat.model';
import { UserService } from '../../../service/user.service';
import { UnReadCountPipe } from '../../../pipes/un-read-count.pipe';
import { VendorService } from '../../../service/vendor.service';

@Component({
  selector: 'app-plain-chat',
  templateUrl: './plain-chat.component.html',
  styleUrls: ['./plain-chat.component.css']
})
export class PlainChatComponent extends ChatComponent {
  constructor(
    public userService: UserService,
    public vendorService: VendorService,
    public fb: FormBuilder,
    public chatService: ChatService,
    public toaster: ToastrService,
    public spinner: NgxSpinnerService,
    public unReadCountPipe: UnReadCountPipe
  ) {
    super(userService, vendorService, fb, chatService, toaster, spinner, unReadCountPipe);
  }

  findChat() {
    return this.chatService.getChat(
      this.id,
      this.type,
      this.type === ChatTypeEnum.VENDOR_ORDER && this.vendorId ? this.vendorId : null,
      (this.user.is_admin || false) && this.type !== ChatTypeEnum.CUSTOMER_ORDER ? this.participants : []
    );
  }

  create() {
    return this.chatService.create(
      this.id,
      this.type,
      this.type === ChatTypeEnum.VENDOR_ORDER && this.vendorId ? this.vendorId : null,
      (this.participants || []).length > 0 ? this.participants : []
    );
  }

  sendMessage(attachment: boolean = false) {
    const text = attachment ? 'Hi' : this.noteFormGroup.get('note').value;
    this.chatService.addMessage(text, this.value.id).subscribe(() => {
      this.noteFormGroup.reset();
      this.loading = false;
      this.getChat();
      if (attachment) {
        this.trigger$.next(true);
      }
    });
  }

  public addNote() {
    this.loading = true;
    if (this.value && this.value.id) {
      this.sendMessage();
    } else {
      this.findChat()
        .pipe(
          map(v => v),
          switchMap(chat => (!chat ? this.create() : of(chat)))
        )
        .subscribe(chat => {
          this.value = chat;
          this.sendMessage();
        });
    }
  }
}
