import {resources} from "../../resources/text.resources";
import {environment} from "../../environments/environment";
import {Input, OnDestroy, OnInit, AfterViewInit} from "@angular/core";

export class ControlBase implements OnInit, OnDestroy {
  @Input() parent:any;
  resources:any = resources;
  environment:any = environment;
  currentUser:any;

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

}
