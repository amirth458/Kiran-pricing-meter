import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../service/user.service';
import { VendorService } from '../../../service/vendor.service';
import { ChatService } from '../../../service/chat.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UnReadCountPipe } from '../../../pipes/un-read-count.pipe';
import { Chat, ChatParticipantEnum, ChatTypeEnum } from '../../../model/chat.model';
import { catchError } from 'rxjs/operators';
import { empty, forkJoin, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-global-chat',
  templateUrl: './global-chat.component.html',
  styleUrls: ['./global-chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GlobalChatComponent implements OnInit {
  @Input() modalInput: any;
  @Output() valueChange: EventEmitter<Chat> = new EventEmitter<Chat>();

  noteFormGroup: FormGroup = this.fb.group({
    note: ['', Validators.required]
  });
  loading: boolean;
  user: any;
  isInitialized = false;
  value: Chat;

  trigger$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public userService: UserService,
    public vendorService: VendorService,
    public fb: FormBuilder,
    public chatService: ChatService,
    public toaster: ToastrService,
    public spinner: NgxSpinnerService,
    public modalService: NgbModal,
    public unReadCountPipe: UnReadCountPipe
  ) {}

  ngOnInit() {
    this.user = this.userService.getUserInfo();
    this.getChat();
  }

  createChat() {
    if (!this.value) {
      this.chatService
        .create(
          this.modalInput.userId,
          ChatTypeEnum.GLOBAL_CHAT,
          null,
          [this.modalInput.userId]
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
    if (this.value && this.isInitialized && (this.value.messageNotes || []).length > 0) {
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
        this.modalInput.userId,
        ChatTypeEnum.GLOBAL_CHAT,
        null,
        [this.modalInput.userId]
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
        this.createChat();
        this.isInitialized = true;
      });
  }

  sendNote(event: KeyboardEvent): void {
    if (event.keyCode === 13 && event.ctrlKey) {
      this.addNote();
    }
  }

  public addNote(attachment: boolean = false) {
    this.loading = true;
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

  onClose() {
    this.modalService.dismissAll();
  }
}
