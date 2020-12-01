import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppComponentBase} from "../AppBaseComponent";

@Component({
  selector: 'app-common-dialog-box',
  templateUrl: './common-dialog-box.component.html',
  styleUrls: ['./common-dialog-box.component.scss']
})
export class CommonDialogBoxComponent extends AppComponentBase implements OnInit {

  constructor(inject: Injector,
  public dialogRef: MatDialogRef<CommonDialogBoxComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,) {
    super(inject);
  }

  ngOnInit(): void {

  }
  submitButton(): void {
    this.dialogRef.close(true);
  }
  cancelButton(): void {
    this.dialogRef.close(false);
  }
}
