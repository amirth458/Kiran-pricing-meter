import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  contactForm: FormGroup = this.fb.group(
    {
      email: ['', Validators.email],
      password: [''],
      confirmPassword: ['']
    },
    { validator: this.checkPasswords }
  );
  user;

  constructor(public fb: FormBuilder, public userService: UserService, public toastrService: ToastrService) {}

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  ngOnInit() {
    const user = this.userService.getUserInfo();
    this.contactForm.setValue({ ...this.contactForm.value, email: user.email });
  }

  async save(ev) {
    if (!this.contactForm.valid) {
      return;
    }
    // update user here
    this.userService
      .changePassword(this.contactForm.value.email, this.contactForm.value.password)
      .pipe(catchError(e => this.handleError(e)))
      .subscribe(() => {
        this.toastrService.success('Password changed successfully!');
      });
  }

  handleError(error: HttpErrorResponse) {
    const message = error.error.message;
    this.toastrService.error(`${message} Please contact your admin`);
    return throwError('Error');
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return this.contactForm.value[field] === '' || this.contactForm.value[field] === null;
    } else if (fieldType === 2) {
      return Number(this.contactForm.value[field]) === 0;
    }
  }
}
