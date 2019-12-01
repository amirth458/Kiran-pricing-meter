import { ICellRendererAngularComp } from "ag-grid-angular";
import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-file-view-renderer",
  templateUrl: "./file-view-renderer.component.html",
  styleUrls: ["./file-view-renderer.component.css"]
})
export class FileViewRendererComponent implements ICellRendererAngularComp {
  params: any;
  constructor(private modalService: NgbModal) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onFileClicked(ev: Event, content) {
    ev.stopPropagation();
    console.log(this.params);
    this.modalService.open(content, {
      centered: true,
      windowClass: "file-viewer-modal"
    });
  }
}
