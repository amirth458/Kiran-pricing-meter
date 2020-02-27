export class Machine {
  id: string;
  vendorId: string;
  name: string;
  serialNumber: string;
  equipment: {
    brandedProcessName: string;
    genericProcessName: string;
    id: number;
    name: string;
    oemDescription: string;
    processFamilyName: string;
    processTypeName: string;
  };
  machineServingMaterialList: Array<{
    createdBy: string;
    createdDate: string;
    id: number;
    lastModifiedBy: string;
    lastModifiedDate: string;
    material: {
      genericName: string;
      id: number;
      materialClassName: string;
      materialFamilyName: string;
      materialTypeName: string;
      name: string;
      oemDescription: string;
    };
  }>;
  vendorFacility: any;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
}
