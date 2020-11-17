import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-step-three',
  templateUrl: './register-step-three.component.html',
  styleUrls: ['./register-step-three.component.scss']
})
export class RegisterStepThreeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  nextPage(): void{
    this.router.navigate(['agent/register-step-four']);
  }
}
