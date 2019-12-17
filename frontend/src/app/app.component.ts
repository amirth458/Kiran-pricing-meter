import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(@Inject(DOCUMENT) document: any) {
    if (environment.local !== true) {
      if (location.protocol === 'http:') {
        document.location.href = location.href.replace('http', 'https');
      }
    }
  }

  ngOnInit(): void {
  }
}
