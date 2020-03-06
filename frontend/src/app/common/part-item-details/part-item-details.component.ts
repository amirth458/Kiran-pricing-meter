import { Component, Input } from '@angular/core';
import { Util } from '../../util/Util';
import { Address } from '../../model/part.model';

@Component({
  selector: 'app-part-item-details',
  templateUrl: './part-item-details.component.html',
  styleUrls: ['./part-item-details.component.css']
})
export class PartItemDetailsComponent {
  @Input('part') part;
  @Input('measurementUnits') measurementUnits;
  @Input('postProcessAction') postProcessAction;

  constructor() {}

  getPartDimension() {
    return Util.getPartDimension(this.part.rfqMedia.media.partDimension, this.measurementUnits || []);
  }

  shippingAddressInfo(address: Address) {
    return Util.shippingAddressInfo(address);
  }

  getUnit(unitId: number) {
    return Util.findMeasurementUnit(this.measurementUnits.metadataList || [], unitId);
  }

  preparePostProcessValues(ids: Array<number>) {
    return Util.preparePostProcessValues(this.postProcessAction, ids);
  }
}
