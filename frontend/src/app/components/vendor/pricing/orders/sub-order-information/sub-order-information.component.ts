import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-sub-order-information",
  templateUrl: "./sub-order-information.component.html",
  styleUrls: ["./sub-order-information.component.css"]
})
export class SubOrderInformationComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  view3D(content) {
    this.modalService.open(content, {
      centered: true,
      windowClass: "model-viewer-modal"
    });
  }
}
