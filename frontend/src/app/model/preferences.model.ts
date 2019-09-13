import { VendorMetaData } from './vendor.model';

export class Preference {
    id: string;
    venderInfoId: string;
    coreCompetencies: Array<string>;
    adjacentGrowth: Array<string>;
    rfqToExclude: Array<string>;
    companiesToExclude: Array<string>;
    createdBy: string;
    createdDate: string;
    updatedDate: string;
}

export interface VendorPreference {
  id: number;
  vendorId: number;
  adjacentGrowth: VendorMetaData;
  clientExclusionCondition: string;
  coreCompetence: VendorMetaData;
  rfqExclusionCondition: string;
}
