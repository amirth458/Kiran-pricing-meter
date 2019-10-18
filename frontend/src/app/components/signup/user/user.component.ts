import { Component, OnInit, AfterViewChecked, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { RegisterUser } from 'src/app/model/user.model';
@Component({
  selector: 'app-register-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class RegisterUserComponent implements OnInit, AfterViewChecked {
  form: FormGroup = this.fb.group({
    email: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    password: [null, Validators.required],
    passwordConfirm: [null, Validators.required],
    phone: [null, Validators.required],
  });
  isLoadedUser = false;
  errorMessage = '';
  isValid = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    const user: RegisterUser = this.userService.getRegisterUserInfo();
    if (user) {
      this.isLoadedUser = true;
      this.initUser(user);
    }
  }
  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to

    const user: RegisterUser = {
      ...this.form.value,
    };
    this.userService.setRegisterUserInfo(user);

    if (this.isValid !== this.form.valid) {
      this.isValid = this.form.valid;
      this.userService.setUserFormStatus(this.form.valid ? 1 : 0);
    }
  }

  initUser(user: RegisterUser): void {
    this.form.setValue({
      ...user
    });
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return this.form.value[field] === '' || this.form.value[field] === null;
    } else if (fieldType === 2) {
      return Number(this.form.value[field]) === 0;
    }
  }

  samePassword() {
    if (this.form.value.passwordConfirm !== '' && this.form.value.passwordConfirm !== null) {
      if (this.form.value.password !== this.form.value.passwordConfirm) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  onSaveUserInformation(event) {

    this.errorMessage = '';
    if (!(this.form.valid)) {
      return;
    }
    this.router.navigateByUrl('/signup/vendor');
  }
}
