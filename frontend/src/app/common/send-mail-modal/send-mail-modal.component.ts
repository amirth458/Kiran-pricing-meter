import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-send-mail-modal',
  templateUrl: './send-mail-modal.component.html',
  styleUrls: ['./send-mail-modal.component.css']
})
export class SendMailModalComponent implements OnInit {
  @Input() from = '';
  @Input() to = '';
  @Input() cc = [];
  @Input() bcc = [];

  @Output() close: EventEmitter<any> = new EventEmitter();

  mailForm: FormGroup;

  constructor(public fb: FormBuilder, public notificationService: NotificationService, public toastr: ToastrService) {}

  ngOnInit() {
    this.mailForm = this.fb.group({
      from: [this.from, [Validators.email, Validators.required]],
      to: [this.to, [Validators.email, Validators.required]],
      cc: [this.cc],
      bcc: [this.bcc],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]]
    });
  }

  onSend() {
    if (this.mailForm.valid) {
      const { from, to, cc, bcc, subject, body } = this.mailForm.value;
      this.notificationService.sendMessage(from, to, cc.join(','), bcc.join(','), subject, body).subscribe(() => {
        this.toastr.success('Message is sent successfully');
        this.onClose();
      });
    } else {
      this.toastr.warning('Complete the form');
    }
  }

  onClose() {
    this.close.emit();
  }

  addTagFn(name) {
    if (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        name
      )
    ) {
      return name;
    }
  }
}
