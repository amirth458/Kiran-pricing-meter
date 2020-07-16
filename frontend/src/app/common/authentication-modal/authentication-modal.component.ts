import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../service/user.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-authentication-modal',
  templateUrl: './authentication-modal.component.html',
  styleUrls: ['./authentication-modal.component.css']
})
export class AuthenticationModalComponent implements OnInit {
  @Input() userInfo;
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() continue: EventEmitter<any> = new EventEmitter<any>();

  submitted = false;
  destroy$: Subject<boolean> = new Subject();

  public form: FormGroup = this.fb.group(
    {
      email: [null, [Validators.required, Validators.email]],
      secretKey: [null, Validators.required]
    }
  );

  constructor(public fb: FormBuilder,
              public toastr: ToastrService,
              public spinner: NgxSpinnerService,
              public userService: UserService) {}

  ngOnInit() {
  }

  get controls() {
    return this.form.controls;
  }

  onCancel() {
    this.cancel.emit({authenticated: false, userInfo: this.userInfo, cancelled: true});
  }

  onContinue(event) {
    this.submitted = true;
    if (this.form.valid) {
      this.spinner.show();
      this.userService
        .authenticateUser(this.form.value.email, this.form.value.secretKey)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          res => {
            this.spinner.hide();
            this.continue.emit({authenticated: res, userInfo: this.userInfo});
          },
          err => {
            this.spinner.hide();
            this.toastr.error('Unable to perform action');
          }
        );
    }
  }
}
