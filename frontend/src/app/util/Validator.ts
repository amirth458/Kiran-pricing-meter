import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { OrderStatusEnum } from 'src/app/model/order.model';

export class Validator {
  static date(control: FormControl): { [key: string]: any } {
    const dt = moment(control.value);
    return !dt.isValid() ? { date: true } : null;
  }

  static match(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.match) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ match: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  static shipping() {
    return (formGroup: FormGroup) => {
      const statusCtl = formGroup.controls['statusId'];
      const carrierCtl = formGroup.controls['carrierId'];
      const trackCtl = formGroup.controls['trackingNo'];

      if (statusCtl.value && statusCtl.value !== OrderStatusEnum.SHIPPED) {
        statusCtl.setErrors(null);
        carrierCtl.setErrors(null);
        trackCtl.setErrors(null);
        return;
      } else if (!statusCtl.value) {
        statusCtl.setErrors({ required: true });
      }

      if (!carrierCtl.value) {
        carrierCtl.setErrors({ required: true });
      }

      if (!trackCtl.value) {
        trackCtl.setErrors({ required: true });
      }

      if (trackCtl.value && carrierCtl.value) {
        statusCtl.setErrors(null);
        carrierCtl.setErrors(null);
        trackCtl.setErrors(null);
      }
    };
  }
}
