import { Component, ContentChild, ElementRef, Input, OnInit } from '@angular/core';

import { catchError } from 'rxjs/operators';
import { empty, forkJoin } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { UserSummary } from '../../../model/user.model';
import { ChatAttachment } from '../../../model/chat.model';
import { ChatService } from '../../../service/chat.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {
  @ContentChild('content') content: ElementRef;
  _chatId: number;
  @Input()
  set chatId(value: number) {
    this._chatId = value;
    this.getAllChatAttachments();
  }
  get chatId(): number {
    return this._chatId;
  }

  files: any[] = [];
  users: Array<UserSummary>;
  user: any;
  attachments: Array<ChatAttachment>;

  public config: PerfectScrollbarConfigInterface = {};

  constructor(
    public spinner: NgxSpinnerService,
    public modalService: NgbModal,
    public toaster: ToastrService,
    public chatService: ChatService,
    public userService: UserService
  ) {
    this.users = [];
    this.attachments = [];
  }

  ngOnInit() {
    this.user = this.userService.getUserInfo();
  }

  openFileManager(content, size: any = 'lg') {
    const options: any = {
      size,
      centered: true,
      windowClass: 'attachment-modal',
      scrollable: true
    };
    this.modalService.open(content, options).result.then(
      result => {},
      reason => {}
    );
  }

  fileDropped($event) {
    this.prepareFilesList($event);
  }

  fileChangeHandler($event) {
    this.prepareFilesList($event.target.files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.files.push(item);
    }
  }

  formatBytes(bytes, decimals: number = 0) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  delete($event, id: number) {
    $event.preventDefault();
    $event.stopPropagation();
    this.chatService
      .deleteChatAttachment(this.chatId, id)
      .pipe(
        catchError(err => {
          this.toaster.error(err.error.message);
          return empty();
        })
      )
      .subscribe(chatAttachment => {
        this.getAllChatAttachments();
      });
  }

  upload() {
    if (this.files.length > 0) {
      this.spinner.show();
      const arr = [];
      for (const file of this.files) {
        arr.push(this.chatService.uploadAttachment(this.chatId, file));
      }
      forkJoin(arr).subscribe(files => {
        this.files = [];
        this.getAllChatAttachments();
        this.toaster.success('Attachments uploaded');
        this.spinner.hide();
      });
    }
  }

  getAllChatAttachments() {
    this.chatService
      .getAllChatAttachments(this.chatId)
      .pipe(
        catchError(err => {
          this.toaster.error(err.error.message);
          return empty();
        })
      )
      .subscribe(v => {
        this.users = v.users;
        this.attachments = v.attachments;
      });
  }
}
