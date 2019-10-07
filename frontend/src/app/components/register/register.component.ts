import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { AppTypes } from 'src/app/store';
import { RegisterUser } from 'src/app/model/user.model';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewChecked {
  form: FormGroup = this.fb.group({
    email: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    password: [null, Validators.required],
    passwordConfirm: [null, Validators.required],
    phone: [null, Validators.required],
    company: [null, Validators.required],
    department: [null],
  });
  isLoadedUser = false;
  errorMessage = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spineer: NgxSpinnerService,
    private authService: AuthService,
    private store: Store<any>,
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
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, (form) => {
      form.addEventListener('submit', (event) => {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
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
    const user: RegisterUser = {
      ...this.form.value
    };
    this.userService.setRegisterUserInfo(user);
    this.store.dispatch({
      type: AppTypes.RegisterStatus,
      payload: {
        userDetails: 1,
      }
    });
  }
}
