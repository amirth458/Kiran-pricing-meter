import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';

import { OrdersService } from '../../service/orders.service';
import { Part, PartDimension } from '../../model/part.model';
import { Util } from '../../util/Util';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnInit {
  _partInfo: Part;
  @Input()
  get partInfo(): Part {
    return this._partInfo;
  }
  set partInfo(value: Part) {
    this._partInfo = value;
    this.pricingService
      .getPartDimension(this._partInfo.id)
      .subscribe(dimension => {
        this.partDimension = dimension;
      });
  }
  @Input()
  measurementUnits: any;
  partDimension: PartDimension;

  @Output() close: EventEmitter<any> = new EventEmitter();
  constructor(public pricingService: RfqPricingService) {}

  ngOnInit() {
    this.pricingService
      .getPartDimension(this.partInfo.id)
      .subscribe(dimension => {
        this.partDimension = dimension;
      });
  }

  getDimension() {
    const metadataList =
      this.measurementUnits && this.measurementUnits.metadataList;
    return (
      this.partDimension &&
      Util.getPartDimension(this.partDimension, metadataList || [])
    );
  }

  getUnit(unitId: number) {
    const unit = (
      (this.measurementUnits && this.measurementUnits.metadataList) ||
      []
    ).filter(u => u.id === unitId)[0];
    return unit ? unit.displayName : '';
  }

  getBoundingBox() {
    const metadataList =
      this.measurementUnits && this.measurementUnits.metadataList;
    return Util.getBoundingBox(this.partDimension, metadataList || []);
  }

  download() {
    let url = this.partInfo.rfqMedia.media.location;
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.setAttribute('target', '_blank');
    a.href = url;
    a.download = this.partInfo.rfqMedia.media.name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  onClose() {
    this.close.emit();
  }
}
