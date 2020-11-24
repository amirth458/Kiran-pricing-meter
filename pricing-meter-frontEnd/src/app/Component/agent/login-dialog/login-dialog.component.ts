import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AppComponentBase} from "../../../Shared/AppBaseComponent";
import {MatIconModule} from "@angular/material/icon";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent extends AppComponentBase implements OnInit {
  public loginForm: FormGroup;


  constructor( public dialogRef: MatDialogRef<LoginDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private formBuilder: FormBuilder,
               inject: Injector) {
    super(inject);
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
    localStorage.setItem('login', 'true');
    this.loginService.isUserLoggedIn.next(true);
    this.navigateTo();
  }
  navigateTo(): void {
    this.dialogRef.close();
    this.router.navigate(['pricing-meter/add-property']);
  }

  closeGallery(): void{
    this.dialogRef.close();
  }

}
