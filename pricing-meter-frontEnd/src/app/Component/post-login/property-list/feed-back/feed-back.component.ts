import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {AppComponentBase} from "../../../../Shared/AppBaseComponent";

@Component({
  selector: 'app-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.scss']
})
export class FeedBackComponent extends AppComponentBase implements OnInit {

  constructor(public dialogRef: MatDialogRef<FeedBackComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private formBuilder: FormBuilder,
  inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
  }

  closeGallery(): void{
    this.dialogRef.close();
  }


}
