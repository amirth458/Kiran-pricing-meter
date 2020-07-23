import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest } from 'rxjs';

import { BiddingService } from '../../../../service/bidding.service';
import { BidPart } from '../../../../model/part.model';
import { MetadataService } from '../../../../service/metadata.service';
import { MetadataConfig } from '../../../../model/metadata.model';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  offerId: number;
  vendorId: number;
  proposalInfo: BidPart[];

  measurementUnits: any;

  get totalCost() {
    return (this.proposalInfo || []).reduce((sum: number, part: BidPart) => {
      const quote = part.partQuoteCustomerView;
      sum += quote.totalCost || 0;
      return sum;
    }, 0);
  }

  constructor(
    public route: Router,
    public router: ActivatedRoute,
    public biddingService: BiddingService,
    public metaDataService: MetadataService
  ) {
    combineLatest(this.router.params, this.router.parent.params).subscribe(v => {
      const params: any = { ...v[0], ...v[1] };
      this.offerId = params.bidPmProjectId || null;
      this.vendorId = params.vendorId || null;
    });
    this.metaDataService.getAdminMetaData(MetadataConfig.MEASUREMENT_UNIT_TYPE).subscribe(res => {
      this.measurementUnits = res;
    });
  }

  ngOnInit() {
    this.getVendorProposal();
  }

  getMediaBackgroundImage(location: string) {
    return {
      'background-image': `url(${location || './assets/image/no-preview.jpg'})`
    };
  }

  getDimension(part: BidPart) {
    if (!((this.measurementUnits || []).length > 0 && part)) {
      return '';
    }
    const arr = [];
    if (part.x && part.x.unitId) {
      const xUnit = this.findUnitById(part.x.unitId);
      arr.push(`${part.x.value} ${xUnit.symbol || ''}`);
    }
    if (part.y && part.y.unitId) {
      const yUnit = this.findUnitById(part.y.unitId);
      arr.push(`${part.y.value} ${yUnit.symbol || ''}`);
    }
    if (part.z && part.z.unitId) {
      const zUnit = this.findUnitById(part.z.unitId);
      arr.push(`${part.z.value} ${zUnit.symbol || ''}`);
    }
    return arr.join(' x ');
  }

  getVolume(part: BidPart) {
    if (!((this.measurementUnits || []).length > 0 && part)) {
      return '';
    }
    let volume = '';
    if (part.volume && part.volume.unitId) {
      const volumeUnit = this.findUnitById(part.volume.unitId);
      volume = `${part.volume.value || 0} ${volumeUnit.symbol || ''}`;
    }
    return volume;
  }

  findUnitById(id: number) {
    const units = (this.measurementUnits || []).filter(unit => unit.id === id);
    return units.length > 0 ? units[0] : null;
  }

  getVendorProposal() {
    this.biddingService.getDetailedPartInfo(this.offerId, this.vendorId).subscribe(offerInfo => {
      this.proposalInfo = offerInfo || [];
    });
  }
}
