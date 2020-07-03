import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { ProdPartComponent } from '../prod-part/prod-part.component';
import { PartService } from '../../service/part.service';

@Component({
  selector: 'app-connect-part',
  templateUrl: './connect-part.component.html',
  styleUrls: ['./../prod-part/prod-part.component.css', './connect-part.component.css']
})
export class ConnectPartComponent extends ProdPartComponent implements OnInit {
  constructor(public modalService: NgbModal, public partService: PartService, public spinner: NgxSpinnerService) {
    super(modalService, partService, spinner);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
