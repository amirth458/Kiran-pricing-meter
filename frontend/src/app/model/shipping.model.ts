export class Shipping {
  id: string;
  vendorId: string;
  shippingProvider: any;
  accountId: string;
  isActive: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
}
export class TrackingInfo {
  trackingNumber: string;
  carrier: string;
  trackDetail: string[];
  response: USPSInfo | UPSInfo | DHLInfo | any;
  successfull: boolean;
}

export class UPSInfo {
  // ALSO DHL EXPRESS
  trackResponse: {
    shipment: Array<{
      package: Array<{
        trackingNumber: string;
        deliveryDate: Array<{
          type: string;
          date: string;
        }>;
        deliveryTime: {
          startTime: string;
          endTime: string;
          type: string;
        };
        activity: Array<{
          location: {
            address: {
              city: string;
              stateProvince: string;
              postalCode: string;
              country: string;
            };
          };
          status: {
            type: string;
            description: string;
            code: string;
          };
          date: string;
          time: string;
        }>;
      }>;
    }>;
  };
  response: null;
}

export class DHLInfo {
  // DHL
  shipments: Array<{
    id: string;
    service: string;
    origin: {
      address: {
        addressLocality: string;
      };
    };
    destination: {
      address: {
        addressLocality: string;
      };
    };
    status: {
      timestamp: string;
      location: {
        address: {
          addressLocality: string;
        };
      };
      statusCode: string;
      status: string;
      description: string;
    };
    details: {
      proofOfDelivery: {
        timestamp: string;
        signatureUrl: string;
        documentUrl: string;
        signed: {
          name: string;
          type: string;
        };
      };
      totalNumberOfPieces: number;
      pieceIds: string[];
    };
    events: Array<{
      timestamp: string;
      location: {
        address: {
          addressLocality: string;
        };
      };
      description: string;
    }>;
    possibleAdditionalShipmentsUrl: string[];
  }>;
}

export class USPSInfo {
  trackInfo: {
    id: string;
    trackSummary: string;
    trackDetail: string[];
  };
}
