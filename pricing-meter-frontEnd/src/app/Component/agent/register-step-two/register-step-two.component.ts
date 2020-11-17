import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-step-two',
  templateUrl: './register-step-two.component.html',
  styleUrls: ['./register-step-two.component.scss']
})
export class RegisterStepTwoComponent implements OnInit {

  public option = false;

  constructor( private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
  }
  getClass(button: string): any {
    if (button === 'indivual') {
      return this.option ? 'btn-active' : 'tab-btn';
    } else {
      return this.option ?   'tab-btn' : 'btn-active';
    }
  }

  navigateTo(): void{
    this.router.navigate(['agent/register-step-three']);
  }
}
