import { Component, OnInit, Input } from '@angular/core';
import { Util } from '../../util/Util';
import { Address } from '../../model/part.model';

@Component({
  selector: 'app-part-item-details',
  templateUrl: './part-item-details.component.html',
  styleUrls: ['./part-item-details.component.css']
})
export class PartItemDetailsComponent implements OnInit {
  @Input('part') part;
  @Input('measurementUnits') measurementUnits;
  constructor() {}

  ngOnInit() {}

  getPartDimension() {
    console.log(this.part.rfqMedia.media.partDimension);

    return Util.getPartDimension(
      this.part.rfqMedia.media.partDimension,
      this.measurementUnits || []
    );
  }

  shippingAddressInfo(address: Address) {
    return Util.shippingAddressInfo(address);
  }

  getUnit(unitId: number) {
    return Util.findMeasurementUnit(
      this.measurementUnits.metadataList || [],
      unitId
    );
  }
}
