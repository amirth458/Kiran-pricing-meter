import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { UserService } from '../../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewChecked {

  userForm: FormGroup = this.fb.group({
    email:[Validators.required],
    password:[Validators.required],
    remember_me: null,
  });


  constructor(
    public fb: FormBuilder,
    private route: Router, 
    private spineer: NgxSpinnerService,
    private userService: UserService) { }

  ngOnInit() {

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


  login(event) {
    
  }
}
