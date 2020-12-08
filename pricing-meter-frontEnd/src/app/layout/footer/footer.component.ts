import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../Shared/AppBaseComponent";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends AppComponentBase implements OnInit {

  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
  }

}
