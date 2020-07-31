import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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
    to: [null, [Validators.required, Validators.email]],
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
  }

  onClose() {
    this.modalService.dismissAll();
  }

  sendTextMessage() {
    this.messageForm.patchValue({ phone: this.userInfo.phoneNo });
    if (this.messageForm.valid) {
      const { phone, message } = this.messageForm.value;
      this.messageService.sendTextMessage(phone, message).subscribe(
        () => {
          this.toastr.success('Text Message Sent');
          this.onClose();
        },
        error => {
          this.toastr.error(error.error.message);
        }
      );
    }
  }

  sendVoiceMessage() {
    this.messageForm.patchValue({ phone: this.userInfo.phoneNo });
    if (this.messageForm.valid) {
      const { phone, message } = this.messageForm.value;
      const res = this.messageService.sendVoiceMessage(phone, message).subscribe(
        () => {
          this.toastr.success('Voice Message Sent');
          this.onClose();
        },
        error => {
          this.toastr.error(error.error.message);
        }
      );
    }
  }

  sendEmail() {
    this.mailForm.patchValue({ to: this.userInfo.email });
    if (this.mailForm.valid) {
      const { to, subject, message } = this.mailForm.value;
      this.notificationService.sendMessage('noreply@3diligent.com', to, null, null, subject, message).subscribe(
        () => {
          this.toastr.success('Email Sent');
          this.onClose();
        },
        error => {
          this.toastr.error(error.error.message);
        }
      );
    }
  }
}
