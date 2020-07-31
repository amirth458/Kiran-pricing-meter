import { Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { MessageService } from '../../service/message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../service/notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessageModalComponent implements OnInit {
  @ViewChild('messageBoxPop') messageModalPop: TemplateRef<any>;

  @Input() modalInput: any;

  isEmailMessage: boolean;
  userInfo: any;

  constructor(
    public modalService: NgbModal,
    public fb: FormBuilder,
    public userService: UserService,
    public messageService: MessageService,
    public spinner: NgxSpinnerService,
    public notificationService: NotificationService,
    public toastr: ToastrService
  ) {}

  mailForm: FormGroup = this.fb.group({
    subject: [null, Validators.required],
    message: [null, Validators.required]
  });

  messageForm: FormGroup = this.fb.group({
    phone: [null, Validators.required],
    message: [null, Validators.required]
  });

  async ngOnInit() {
    this.spinner.show();
    this.isEmailMessage = this.modalInput.isMessageEmail;
    this.userInfo = await this.userService.getUserDetails(this.modalInput.userId).toPromise();
    this.spinner.hide();
    this.modalService.open(this.messageModalPop);
  }

  onClose() {
    this.modalService.dismissAll();
  }

  sendTextMessage(phoneNo: any) {
    if (this.messageForm.valid) {
      const { message } = this.messageForm.value;
      this.messageService.sendTextMessage(phoneNo, message).subscribe(() => {
        this.toastr.success('Text Message Sent');
        this.onClose();
      });
    }
  }

  sendVoiceMessage(phoneNo: any) {
    if (this.messageForm.valid && phoneNo) {
      const { message } = this.messageForm.value;
      const res = this.messageService.sendVoiceMessage(phoneNo, message).subscribe(() => {
        this.toastr.success('Voice Message Sent');
        this.onClose();
      });
    }
  }

  sendEmail(receiverEmail: string) {
    if (this.mailForm.valid && receiverEmail) {
      const { subject, message } = this.mailForm.value;
      this.notificationService
        .sendMessage('noreply@3diligent.com', receiverEmail, null, null, subject, message)
        .subscribe(() => {
          this.toastr.success('Email Sent');
          this.onClose();
        });
    }
  }
}
