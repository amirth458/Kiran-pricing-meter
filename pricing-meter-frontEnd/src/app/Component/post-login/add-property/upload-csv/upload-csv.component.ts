import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../../../Shared/AppBaseComponent";

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})
export class UploadCsvComponent extends AppComponentBase implements OnInit {

  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
  }

}
