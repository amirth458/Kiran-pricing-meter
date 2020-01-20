import { Component, Output, EventEmitter, Input } from '@angular/core';

import { map } from "rxjs/operators";

import { OrdersService } from '../../service/orders.service';
import { Part, PartDimension } from '../../model/part.model';
import { Util } from '../../util/Util';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent {
  _partInfo: Part;
  @Input()
  get partInfo(): Part {
    return this._partInfo;
  }
  set partInfo(value: Part) {
    this._partInfo = value;
    if (value.rfqMedia && value.rfqMedia.media) {
      this.partDimension = value.rfqMedia.media.partDimension || null;
    }
  }
  @Input()
  measurementUnits: any;
  partDimension: PartDimension;

  @Output() close: EventEmitter<any> = new EventEmitter();
  constructor(public orderService: OrdersService) { }

  getDimension() {
    const metadataList =
      this.measurementUnits && this.measurementUnits.metadataList;
    return Util.getPartDimension(
      this.partInfo.rfqMedia.media.partDimension,
      metadataList || []
    );
  }

  getUnit(unitId: number) {
    const unit = (this.measurementUnits && this.measurementUnits.metadataList).filter(u => u.id === unitId)[0];
    return unit ? unit.displayName : '';
  }

  getBoundingBox() {
    const metadataList =
      this.measurementUnits && this.measurementUnits.metadataList;
    return Util.getBoundingBox(
      this.partDimension,
      metadataList || []
    );
  }

  download() {
    this.orderService.downloadActualFile(this.partInfo.rfqMedia.media.location)
      .pipe(
        map(res => {
          return {
            filename: this.partInfo.rfqMedia.media.name,
            data: res
          };
        })
      ).subscribe(res => {
        let url = window.URL.createObjectURL(res.data);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    });
  }

  onClose() {
    this.close.emit();
  }
}
