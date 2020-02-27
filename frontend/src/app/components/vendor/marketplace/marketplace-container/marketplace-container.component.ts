import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketplace-container',
  templateUrl: './marketplace-container.component.html',
  styleUrls: ['./marketplace-container.component.css']
})
export class MarketplaceContainerComponent implements OnInit {
  baseURL = '';

  sidemenuClosed: boolean;

  constructor(private route: Router) {
    this.baseURL = this.route.url.split('/')[1];
  }

  ngOnInit() {}
}
