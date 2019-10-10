import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})

export class RegisterCompletedComponent implements OnInit {
  constructor(
   private router: Router,
  ) {

  }

  ngOnInit() {

  }
}
