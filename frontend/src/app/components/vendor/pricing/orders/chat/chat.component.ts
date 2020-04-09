import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Chat, ChatTypeEnum } from '../../../../../model/chat.model';
import { ChatService } from '../../../../../service/chat.service';
import { UserService } from '../../../../../service/user.service';
import { VendorService } from '../../../../../service/vendor.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  idValue: number;
  @Input()
  set id(value: number) {
    this.idValue = value;
  }
  get id(): number {
    return this.idValue;
  }
  @Input() participants: Array<number>;
  @Input() type: ChatTypeEnum;
  @Input() value: Chat;

  @Output() valueChange: EventEmitter<Chat> = new EventEmitter<Chat>();

  noteFormGroup: FormGroup = this.fb.group({
    note: ['', Validators.required]
  });
  loading: boolean;
  disableScrollDown = false;

  vendor: any;
  user: any;

  constructor(
    public userService: UserService,
    public vendorService: VendorService,
    public fb: FormBuilder,
    public chatService: ChatService,
    public toaster: ToastrService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.vendor = this.type === ChatTypeEnum.VENDOR_ORDER ? this.userService.getVendorInfo() : null;
    this.user = this.userService.getUserInfo();
    this.getChat();
  }

  openChat($event) {
    $event.preventDefault();
    $event.stopPropagation();
    if (!this.value) {
      this.chatService
        .create(
          this.id,
          this.type,
          this.vendor ? this.vendor.id : null,
          (this.participants || []).length > 0 ? this.participants : []
        )
        .pipe(
          catchError(err => {
            this.handleError(err.error.message);
            return empty();
          })
        )
        .subscribe(chat => (this.value = chat));
    }
  }

  handleError(message: string) {
    this.loading = false;
    this.toaster.error(`Failed: ${message}`);
  }

  getChat() {
    this.loading = true;
    this.chatService
      .getChat(
        this.id,
        this.type,
        this.vendor ? this.vendor.id : null,
        (this.user.is_admin || false) && this.type !== ChatTypeEnum.CUSTOMER_ORDER ? this.participants : []
      )
      .pipe(
        catchError(err => {
          this.handleError(err.error.message);
          return empty();
        })
      )
      .subscribe(chat => {
        this.loading = false;
        this.value = chat;
      });
  }

  sendNote(event: KeyboardEvent): void {
    if (event.keyCode === 13 && event.ctrlKey) {
      this.addNote();
    }
  }

  addNote() {
    this.loading = true;
    this.chatService.addMessage(this.noteFormGroup.get('note').value, this.value.id).subscribe(() => {
      this.noteFormGroup.reset();
      this.loading = false;
      this.getChat();
    });
  }

  onScroll() {
    const element = document.querySelector('.message-container');
    if (element) {
      const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
      this.disableScrollDown = !(this.disableScrollDown && atBottom);
    }
  }

  scrollToBottom(): void {
    if (this.disableScrollDown) {
      return;
    }
    try {
      const element = document.querySelector('.message-container');
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {}
  }
}
