import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { AppTypes } from 'src/app/store';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewChecked {

  userForm: FormGroup = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
    remember_me: null,
  });

  errorMessage = '';

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public spineer: NgxSpinnerService,
    public authService: AuthService,
    private store: Store<any>,
    public userService: UserService) {}

  ngOnInit() {
    const rememberMe = localStorage.getItem('remember_me');
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (rememberMe === '1') {
      this.userForm.setValue({
        email,
        password,
        remember_me: null,
      });
      this.login();
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
        } else {

        }
        form.classList.add('was-validated');
      }, false);
    });
  }

  login() {
    this.errorMessage = '';
    if (!(this.userForm.valid)) {
      return;
    }
    this.spineer.show();

    this.authService.login(this.userForm.value.email, this.userForm.value.password).subscribe(res => {
      this.authService.setAuthData(res);
      if (this.userForm.value.remember_me) {
        localStorage.setItem('remember_me', '1');
        localStorage.setItem('email', this.userForm.value.email);
        localStorage.setItem('password', this.userForm.value.password);
      }

      this.store.dispatch({
        type: AppTypes.GetVendorInfo
      });
      this.store.dispatch({
        type: AppTypes.GetUserInfo
      });

      this.router.navigate(['/profile']);
      this.spineer.hide();
    }, error => {
      console.log(error);
      this.loginErrorHandler(error);
      this.spineer.hide();
    });

  }

  loginErrorHandler(error) {
    switch (error.status) {
      case 404:
        this.errorMessage = 'Authentication service does not exist.';
        break;
      case 401:
        this.errorMessage = 'Login credentials is incorrect.';
        break;
      case 500:
        this.errorMessage = 'Error on Server';
        break;
      default:
        this.errorMessage = 'Error on Server';
        break;
    }
  }
}
