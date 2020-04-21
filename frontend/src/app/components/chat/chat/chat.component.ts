import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { empty, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Chat, ChatTypeEnum } from '../../../model/chat.model';
import { ChatService } from '../../../service/chat.service';
import { UserService } from '../../../service/user.service';
import { VendorService } from '../../../service/vendor.service';
import { UnReadCountPipe } from '../../../pipes/un-read-count.pipe';

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
  @Input() vendorId: number;

  @Output() valueChange: EventEmitter<Chat> = new EventEmitter<Chat>();

  noteFormGroup: FormGroup = this.fb.group({
    note: ['', Validators.required]
  });
  loading: boolean;
  disableScrollDown = false;
  user: any;
  isInitialised = false;

  constructor(
    public userService: UserService,
    public vendorService: VendorService,
    public fb: FormBuilder,
    public chatService: ChatService,
    public toaster: ToastrService,
    public spinner: NgxSpinnerService,
    public unReadCountPipe: UnReadCountPipe
  ) {}

  ngOnInit() {
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
          this.type === ChatTypeEnum.VENDOR_ORDER && this.vendorId ? this.vendorId : null,
          (this.participants || []).length > 0 ? this.participants : []
        )
        .pipe(
          catchError(err => {
            this.handleError(err.error.message);
            return empty();
          })
        )
        .subscribe(chat => (this.value = chat));
    } else {
      this.updateChat();
    }
  }

  updateChat() {
    if (this.value && this.isInitialised && (this.value.messageNotes || []).length > 0) {
      const count = this.unReadCountPipe.transform(this.value.messageNotes, this.user.id);
      if (count > 0) {
        this.markReadMessage();
      }
    }
  }

  markReadMessage() {
    const histories = [];
    const filteredItems = (this.value.messageNotes || []).filter(note => note.senderId !== this.user.id);
    filteredItems.map(message => {
      const item = message.messageNoteHistory.filter(history => !history.isRead);
      if (item.length > 0) {
        histories.push(item[0]);
      }
    });
    if (histories.length > 0) {
      const arr = histories.map((history: any) => this.chatService.markUnreadMessage(history.id));
      forkJoin(arr).subscribe(v => {
        this.getChat();
      });
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
        this.type === ChatTypeEnum.VENDOR_ORDER && this.vendorId ? this.vendorId : null,
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
        this.updateChat();
        this.isInitialised = true;
      });
  }

  sendNote(event: KeyboardEvent): void {
    if (event.keyCode === 13 && event.ctrlKey) {
      this.addNote();
    }
  }

  public addNote() {
    this.loading = true;
    this.chatService.addMessage(this.noteFormGroup.get('note').value, this.value.id).subscribe(() => {
      this.noteFormGroup.reset();
      this.loading = false;
      this.getChat();
    });
  }
}
