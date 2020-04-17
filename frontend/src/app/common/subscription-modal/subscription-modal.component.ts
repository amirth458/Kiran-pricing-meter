import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.css']
})
export class SubscriptionModalComponent implements OnInit {
  @Input() subscriptions;
  @Input() addons;
  @Input() contractInfo;
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() ok: EventEmitter<any> = new EventEmitter<any>();

  subscription = null;

  cost = 0;

  form: FormGroup = this.fb.group({
    subscription: ['', [Validators.required]],
    addon: [[]]
  });

  constructor(public fb: FormBuilder, public currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    if (this.contractInfo) {
      this.form.setValue({
        subscription: this.contractInfo.contract.subscriptionType.id,
        addon: this.contractInfo.contract.addOnsIds
      });
    }
    this.onValueChange();
  }

  onCancel() {
    this.cancel.emit();
  }

  onOk() {
    if (this.form.valid) {
      this.ok.emit(this.form.value);
    }
  }

  onValueChange() {
    this.cost = 0;

    if (this.form.value.subscription) {
      this.subscription = this.subscriptions.find(item => item.id === this.form.value.subscription);
      this.cost = this.subscription ? this.subscription.cost : 0;
    } else {
      this.subscription = null;
    }

    console.log(this.addons.filter(item => this.form.value.addon.includes(item.id)));
    this.cost += this.addons
      .filter(item => this.form.value.addon.includes(item.id))
      .reduce((s, c) => s + (c.cost || 0), 0);
  }
}
