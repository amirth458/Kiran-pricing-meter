import {Component, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AppComponentBase} from "../../../Shared/AppBaseComponent";

@Component({
  selector: 'app-register-step-one',
  templateUrl: './register-step-one.component.html',
  styleUrls: ['./register-step-one.component.scss']
})
export class RegisterStepOneComponent extends AppComponentBase implements OnInit {

  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*) |(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const pwdPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/;
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
      password: ['', [Validators.required, Validators.pattern(pwdPattern)]],
      firstName: ['', [Validators.required, Validators.maxLength(30) , Validators.minLength(4)]],
      lastName : ['', [Validators.required, Validators.maxLength(30) , Validators.minLength(4)]],
    });
  }

  onSubmit(): void {
    this.navigateTo();
  }
  navigateTo(): void {
    this.router.navigate(['agent/register-step-two']);
  }
}
