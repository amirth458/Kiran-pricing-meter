import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { ChatComponent } from '../pricing/orders/chat/chat.component';
import { ChatService } from '../../../service/chat.service';
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
}
