import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Validator } from '../../util/Validator';

@Component({
  selector: 'app-authentication-modal',
  templateUrl: './authentication-modal.component.html',
  styleUrls: ['./authentication-modal.component.css']
})
export class AuthenticationModalComponent implements OnInit {
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() continue: EventEmitter<any> = new EventEmitter<any>();

  submitted = false;

  public form: FormGroup = this.fb.group(
    {
      email: [null, [Validators.required, Validators.email]],
      secretKey: [null, Validators.required]
    }
  );

  constructor(public fb: FormBuilder) {}

  ngOnInit() {
  }

  get controls() {
    return this.form.controls;
  }

  onCancel() {
    this.cancel.emit();
  }

  onContinue(event) {
    this.submitted = true;
    if (this.form.valid) {
      this.continue.emit(this.form.value);
    }
  }
}
