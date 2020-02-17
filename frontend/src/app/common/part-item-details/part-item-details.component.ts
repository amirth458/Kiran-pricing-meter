import { Component, OnInit, Input } from '@angular/core';
import { Util } from "../../util/Util";
import { Address } from "../../model/part.model";

@Component({
  selector: 'app-part-item-details',
  templateUrl: './part-item-details.component.html',
  styleUrls: ['./part-item-details.component.css']
})
export class PartItemDetailsComponent implements OnInit {

  @Input('part') part =
    {
      id: 1089,
      name: null,
      rfqMedia: {
        id: 1290,
        projectRfqId: 1157,
        media: {
          id: 2284,
          name: "jaw-original.stl",
          uploadedAt: "2020-02-07T22:40:13.616+0000",
          connectorServiceId: 3109,
          fileType: {
            id: 2,
            name: "stl",
            description: "stl"
          },
          location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2020/02/07/2020-02-07_22-40-13-procurement_1335841175247640779794jaw-original.stl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200217T112235Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=9eac0b99d0a21d4b268e2376790cee70cb9890fc3ee772396f108d5926df772c",
          customerId: 133,
          partDimension: {
            id: 1955,
            name: "jaw-original.stl",
            x: {
              value: 3.05377,
              valueInDefaultUnit: 305.377,
              unitId: 3
            },
            y: {
              value: 0.99,
              valueInDefaultUnit: 99,
              unitId: 3
            },
            z: {
              value: 1.33839,
              valueInDefaultUnit: 133.839,
              unitId: 3
            },
            volume: {
              value: 1.8024220903,
              valueInDefaultUnit: 180.24220903,
              unitId: 3
            },
            surfaceArea: {
              value: 15.1556763726,
              valueInDefaultUnit: 1515.56763726,
              unitId: 3
            },
            thumbnail100Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/02/07/2020-02-07_22-41-10-3109/d41adb47-58de-47b5-a0d5-c79fb439a06d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200217T112235Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=2cf267ce5e1409780f6524947bf0ba16a91f20f1074d85989dae465f6f0215ff",
            thumbnail200Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/02/07/2020-02-07_22-41-10-3109/42792761-8b62-4b47-8df5-b87df344e276.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200217T112235Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=dfd95887ad62b5a401eb3adb34258c116c46ed7d77ab14ebf64b6507a599d096",
            thumbnail400Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/02/07/2020-02-07_22-41-10-3109/471ea7f6-8c0d-4961-869a-5c7e8ed476d9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200217T112235Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=e790fdb89cc3016b93fec5a5352ace3de61b9cb3652bf67e5c0c3e184791e551",
            partDimensionStatusType: {
              id: 2,
              name: "COMPLETED",
              description: "COMPLETED"
            },
            mediaId: 2284,
            fileLocation: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2020/02/07/2020-02-07_22-40-13-procurement_1335841175247640779794jaw-original.stl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200217T112235Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=9eac0b99d0a21d4b268e2376790cee70cb9890fc3ee772396f108d5926df772c"
          }
        },
        partList: [
          {
            id: 1089,
            name: null,
            rfqMedia: {
              id: 1290,
              projectRfqId: 1157,
              media: {
                id: 2284,
                name: "jaw-original.stl",
                uploadedAt: "2020-02-07T22:40:13.616+0000",
                connectorServiceId: 3109,
                fileType: {
                  id: 2,
                  name: "stl",
                  description: "stl"
                },
                location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2020/02/07/2020-02-07_22-40-13-procurement_1335841175247640779794jaw-original.stl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200207T233404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b7cd7ec28aa602950c2e47edfa0a50413ad202c8c010b9603aeee886f2874279",
                customerId: 133,
                partDimension: {
                  id: 1955,
                  name: "jaw-original.stl",
                  x: {
                    value: 3.05377,
                    valueInDefaultUnit: 305.377,
                    unitId: 3
                  },
                  y: {
                    value: 0.99,
                    valueInDefaultUnit: 99,
                    unitId: 3
                  },
                  z: {
                    value: 1.33839,
                    valueInDefaultUnit: 133.839,
                    unitId: 3
                  },
                  volume: {
                    value: 1.8024220903,
                    valueInDefaultUnit: 180.24220903,
                    unitId: 3
                  },
                  surfaceArea: {
                    value: 15.1556763726,
                    valueInDefaultUnit: 1515.56763726,
                    unitId: 3
                  },
                  thumbnail100Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/02/07/2020-02-07_22-41-10-3109/d41adb47-58de-47b5-a0d5-c79fb439a06d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200207T233404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=60c79bd9ba48fc689b2ee587a5a6929a29aaaa9c0e61102f4684e85206fdb3f9",
                  thumbnail200Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/02/07/2020-02-07_22-41-10-3109/42792761-8b62-4b47-8df5-b87df344e276.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200207T233404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=ca30c2b47a0f49bac407fd243c59afb31ba74e8fabc9b04cb440ee995317168b",
                  thumbnail400Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/02/07/2020-02-07_22-41-10-3109/471ea7f6-8c0d-4961-869a-5c7e8ed476d9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200207T233404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=8fa50c52344fb50e1b856f881cfe28140918f0eb880e58a75a2a0d7a22cf5e12",
                  partDimensionStatusType: {
                    id: 2,
                    name: "COMPLETED",
                    description: "COMPLETED"
                  },
                  mediaId: 2284,
                  fileLocation: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2020/02/07/2020-02-07_22-40-13-procurement_1335841175247640779794jaw-original.stl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200207T233404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b7cd7ec28aa602950c2e47edfa0a50413ad202c8c010b9603aeee886f2874279"
                }
              },
              partList: null
            },
            cuttingBondingAllowed: null,
            quantity: 25,
            targetDeliveryDate: null,
            shippingCost: null,
            shippedAt: null,
            manualPricingAllowed: false,
            shippingAddress: null,
            partStatusType: {
              id: 6,
              name: "PLACING_ORDER",
              description: "Placing Order",
              displayName: "Placing Order",
              display: true
            },
            order: {
              id: 67,
              customerId: null,
              vendorOrderId: null,
              orderStatusType: {
                id: 2,
                name: "ORDER_IN_PROGRESS",
                description: "Order In Progress"
              },
              paymentStatusType: null,
              isArchived: null,
              partList: null
            },
            postProcessTypeIds: [],
            partCustomParameterList: [
              {
                id: 540,
                targetValue: null,
                targetOperatorTypeId: null,
                targetUnitTypeId: null,
                partParameterType: {
                  id: 1,
                  name: "SURFACE_ROUGHNESS",
                  description: "SURFACE_ROUGHNESS"
                },
                partId: 1089,
                parameterTolerance: null
              }
            ],
            expiredAt: "2020-02-09T22:43:48.257+0000",
            materialPropertyType: "NAME",
            materialPropertyValues: [
              "EnvisionTEC ABS 3SP"
            ],
            materialIds: [
              7
            ],
            equipmentPropertyType: null,
            equipmentPropertyValues: null,
            equipmentIds: null,
            isArchive: false
          }
        ]
      },
      cuttingBondingAllowed: null,
      quantity: 25,
      targetDeliveryDate: null,
      shippingCost: null,
      shippedAt: null,
      manualPricingAllowed: false,
      shippingAddress: null,
      partStatusType: {
        id: 6,
        name: "PLACING_ORDER",
        description: "Placing Order",
        displayName: "Placing Order",
        display: true
      },
      order: {
        id: 67,
        customerId: 133,
        vendorOrderId: null,
        orderStatusType: {
          id: 2,
          name: "ORDER_IN_PROGRESS",
          description: "Order In Progress"
        },
        paymentStatusType: null,
        isArchived: false,
        partList: [
          {
            id: 1089,
            name: null,
            rfqMedia: {
              id: 1290,
              projectRfqId: 1157,
              media: {
                id: 2284,
                name: "jaw-original.stl",
                uploadedAt: "2020-02-07T22:40:13.616+0000",
                connectorServiceId: 3109,
                fileType: {
                  id: 2,
                  name: "stl",
                  description: "stl"
                },
                location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2020/02/07/2020-02-07_22-40-13-procurement_1335841175247640779794jaw-original.stl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200207T233404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b7cd7ec28aa602950c2e47edfa0a50413ad202c8c010b9603aeee886f2874279",
                customerId: 133,
                partDimension: {
                  id: 1955,
                  name: "jaw-original.stl",
                  x: {
                    value: 3.05377,
                    valueInDefaultUnit: 305.377,
                    unitId: 3
                  },
                  y: {
                    value: 0.99,
                    valueInDefaultUnit: 99,
                    unitId: 3
                  },
                  z: {
                    value: 1.33839,
                    valueInDefaultUnit: 133.839,
                    unitId: 3
                  },
                  volume: {
                    value: 1.8024220903,
                    valueInDefaultUnit: 180.24220903,
                    unitId: 3
                  },
                  surfaceArea: {
                    value: 15.1556763726,
                    valueInDefaultUnit: 1515.56763726,
                    unitId: 3
                  },
                  thumbnail100Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/02/07/2020-02-07_22-41-10-3109/d41adb47-58de-47b5-a0d5-c79fb439a06d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200207T233404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=60c79bd9ba48fc689b2ee587a5a6929a29aaaa9c0e61102f4684e85206fdb3f9",
                  thumbnail200Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/02/07/2020-02-07_22-41-10-3109/42792761-8b62-4b47-8df5-b87df344e276.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200207T233404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=ca30c2b47a0f49bac407fd243c59afb31ba74e8fabc9b04cb440ee995317168b",
                  thumbnail400Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/02/07/2020-02-07_22-41-10-3109/471ea7f6-8c0d-4961-869a-5c7e8ed476d9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200207T233404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=8fa50c52344fb50e1b856f881cfe28140918f0eb880e58a75a2a0d7a22cf5e12",
                  partDimensionStatusType: {
                    id: 2,
                    name: "COMPLETED",
                    description: "COMPLETED"
                  },
                  mediaId: 2284,
                  fileLocation: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2020/02/07/2020-02-07_22-40-13-procurement_1335841175247640779794jaw-original.stl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200207T233404Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b7cd7ec28aa602950c2e47edfa0a50413ad202c8c010b9603aeee886f2874279"
                }
              },
              partList: null
            },
            cuttingBondingAllowed: null,
            quantity: 25,
            targetDeliveryDate: null,
            shippingCost: null,
            shippedAt: null,
            manualPricingAllowed: false,
            shippingAddress: null,
            partStatusType: {
              id: 6,
              name: "PLACING_ORDER",
              description: "Placing Order",
              displayName: "Placing Order",
              display: true
            },
            order: {
              id: 67,
              customerId: null,
              vendorOrderId: null,
              orderStatusType: {
                id: 2,
                name: "ORDER_IN_PROGRESS",
                description: "Order In Progress"
              },
              paymentStatusType: null,
              isArchived: null,
              partList: null
            },
            postProcessTypeIds: [],
            partCustomParameterList: [
              {
                id: 540,
                targetValue: null,
                targetOperatorTypeId: null,
                targetUnitTypeId: null,
                partParameterType: {
                  id: 1,
                  name: "SURFACE_ROUGHNESS",
                  description: "SURFACE_ROUGHNESS"
                },
                partId: 1089,
                parameterTolerance: null
              }
            ],
            expiredAt: "2020-02-09T22:43:48.257+0000",
            materialPropertyType: "NAME",
            materialPropertyValues: [
              "EnvisionTEC ABS 3SP"
            ],
            materialIds: [
              7
            ],
            equipmentPropertyType: null,
            equipmentPropertyValues: null,
            equipmentIds: null,
            isArchive: false
          }
        ]
      },
      postProcessTypeIds: [],
      partCustomParameterList: [
        {
          id: 540,
          targetValue: null,
          targetOperatorTypeId: null,
          targetUnitTypeId: null,
          partParameterType: {
            id: 1,
            name: "SURFACE_ROUGHNESS",
            description: "SURFACE_ROUGHNESS"
          },
          partId: 1089,
          parameterTolerance: null
        }
      ],
      expiredAt: "2020-02-09T22:43:48.257+0000",
      materialPropertyType: "NAME",
      materialPropertyValues: [
        "EnvisionTEC ABS 3SP"
      ],
      materialIds: [
        7
      ],
      equipmentPropertyType: null,
      equipmentPropertyValues: null,
      equipmentIds: null,
      isArchive: false
    };
  @Input('measurementUnits') measurementUnits = {
    metadataType: "measurement_unit_type",
    metadataList: [
      {
        id: 17,
        name: "celsius",
        symbol: "°C",
        displayName: "celsius(°C)",
        measurementType: {
          id: 7,
          name: "temperature"
        },
        isDefault: true
      },
      {
        id: 58,
        name: "centimeter per hour",
        symbol: "cm/hr",
        displayName: "centimeter per hour(cm/hr)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 57,
        name: "centimeter per minute",
        symbol: "cm/minute",
        displayName: "centimeter per minute(cm/minute)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 56,
        name: "centimeter per second",
        symbol: "cm/second",
        displayName: "centimeter per second(cm/second)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 2,
        name: "centimeters",
        symbol: "cm",
        displayName: "centimeter(cm)",
        measurementType: {
          id: 1,
          name: "length"
        },
        isDefault: true
      },
      {
        id: 21,
        name: "chemical resistance rating",
        symbol: "",
        displayName: "chemical resistance rating",
        measurementType: {
          id: 11,
          name: "alphanumeric"
        },
        isDefault: true
      },
      {
        id: 16,
        name: "count",
        symbol: "",
        displayName: "count",
        measurementType: {
          id: 5,
          name: "arithmetic - numeric"
        },
        isDefault: true
      },
      {
        id: 63,
        name: "cubic centimeter per hour",
        symbol: "cm3/hr",
        displayName: "cubic centimeter per hour(cm3/hr)",
        measurementType: {
          id: 16,
          name: "volume velocity"
        },
        isDefault: true
      },
      {
        id: 6,
        name: "cubic centimeters",
        symbol: "cu cm",
        displayName: "cubic centimeter(cu cm)",
        measurementType: {
          id: 3,
          name: "volume"
        },
        isDefault: true
      },
      {
        id: 67,
        name: "cubic feet per hour",
        symbol: "ft3/hr",
        displayName: "cubic feet per hour(ft3/hr)",
        measurementType: {
          id: 16,
          name: "volume velocity"
        },
        isDefault: false
      },
      {
        id: 22,
        name: "cubic foot",
        symbol: "cu ft",
        displayName: "cubic foot(cu ft)",
        measurementType: {
          id: 3,
          name: "volume"
        },
        isDefault: false
      },
      {
        id: 23,
        name: "cubic inch",
        symbol: "cu in",
        displayName: "cubic inch(cu in)",
        measurementType: {
          id: 3,
          name: "volume"
        },
        isDefault: false
      },
      {
        id: 66,
        name: "cubic inches per hour",
        symbol: "in3/hr",
        displayName: "cubic inches per hour(in3/hr)",
        measurementType: {
          id: 16,
          name: "volume velocity"
        },
        isDefault: false
      },
      {
        id: 65,
        name: "cubic meter per hour",
        symbol: "m3/hr",
        displayName: "cubic meter per hour(m3/hr)",
        measurementType: {
          id: 16,
          name: "volume velocity"
        },
        isDefault: false
      },
      {
        id: 52,
        name: "cubic meters",
        symbol: "cu m",
        displayName: "cubic meter(cu m)",
        measurementType: {
          id: 3,
          name: "volume"
        },
        isDefault: false
      },
      {
        id: 55,
        name: "cubic micrometers",
        symbol: "cu µm",
        displayName: "cubic micrometer(cu µm)",
        measurementType: {
          id: 3,
          name: "volume"
        },
        isDefault: false
      },
      {
        id: 64,
        name: "cubic millimeter per hour",
        symbol: "mm3/hr",
        displayName: "cubic millimeter per hour(mm3/hr)",
        measurementType: {
          id: 16,
          name: "volume velocity"
        },
        isDefault: false
      },
      {
        id: 51,
        name: "cubic millimeters",
        symbol: "cu mm",
        displayName: "cubic millimeter(cu mm)",
        measurementType: {
          id: 3,
          name: "volume"
        },
        isDefault: false
      },
      {
        id: 15,
        name: "day",
        symbol: "day",
        displayName: "day",
        measurementType: {
          id: 6,
          name: "datetime"
        },
        isDefault: false
      },
      {
        id: 18,
        name: "fahrenheit",
        symbol: "°F",
        displayName: "fahrenheit(°F)",
        measurementType: {
          id: 7,
          name: "temperature"
        },
        isDefault: false
      },
      {
        id: 5,
        name: "feet",
        symbol: "'",
        displayName: "feet(')",
        measurementType: {
          id: 1,
          name: "length"
        },
        isDefault: false
      },
      {
        id: 62,
        name: "feet per hour",
        symbol: "ft/hr",
        displayName: "feet per hour(ft/hr)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 24,
        name: "feet per second",
        symbol: "ft/s",
        displayName: "feet per second(ft/s)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 28,
        name: "gram",
        symbol: "g",
        displayName: "gram(g)",
        measurementType: {
          id: 2,
          name: "weight"
        },
        isDefault: true
      },
      {
        id: 45,
        name: "grams per cubic centimeter",
        symbol: "g/cc",
        displayName: "grams per cubic centimeter(g/cc)",
        measurementType: {
          id: 14,
          name: "density"
        },
        isDefault: true
      },
      {
        id: 50,
        name: "hardness",
        symbol: "",
        displayName: "hardness",
        measurementType: {
          id: 13,
          name: "hardness"
        },
        isDefault: false
      },
      {
        id: 14,
        name: "hour",
        symbol: "hr",
        displayName: "hour",
        measurementType: {
          id: 6,
          name: "datetime"
        },
        isDefault: false
      },
      {
        id: 4,
        name: "inch",
        symbol: "\"",
        displayName: "inch(\")",
        measurementType: {
          id: 1,
          name: "length"
        },
        isDefault: false
      },
      {
        id: 61,
        name: "inches per hour",
        symbol: "in/hr",
        displayName: "inches per hour(in/hr)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 33,
        name: "kelvin",
        symbol: "°K",
        displayName: "kelvin(°K)",
        measurementType: {
          id: 7,
          name: "temperature"
        },
        isDefault: false
      },
      {
        id: 29,
        name: "kilogram",
        symbol: "kg",
        displayName: "kilogram(kg)",
        measurementType: {
          id: 2,
          name: "weight"
        },
        isDefault: false
      },
      {
        id: 74,
        name: "kilometers",
        symbol: "km",
        displayName: "kilometers (km)",
        measurementType: {
          id: 18,
          name: "distance"
        },
        isDefault: true
      },
      {
        id: 49,
        name: "kilowatt",
        symbol: "kW",
        displayName: "kilowatt (kW)",
        measurementType: {
          id: 15,
          name: "power"
        },
        isDefault: false
      },
      {
        id: 8,
        name: "liter",
        symbol: "ℓ",
        displayName: "liter(ℓ)",
        measurementType: {
          id: 3,
          name: "volume"
        },
        isDefault: false
      },
      {
        id: 11,
        name: "megapascal pressure unit",
        symbol: "MPa",
        displayName: "megapascal pressure unit(MPa)",
        measurementType: {
          id: 4,
          name: "pressure"
        },
        isDefault: true
      },
      {
        id: 60,
        name: "meter per hour",
        symbol: "m/hr",
        displayName: "meter per hour(m/hr)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 3,
        name: "meters",
        symbol: "m",
        displayName: "meter(m)",
        measurementType: {
          id: 1,
          name: "length"
        },
        isDefault: false
      },
      {
        id: 26,
        name: "meters per second",
        symbol: "m/s",
        displayName: "meters per second(m/s)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 10,
        name: "micro-Inch",
        symbol: "µin",
        displayName: "micro-inch(µin)",
        measurementType: {
          id: 1,
          name: "length"
        },
        isDefault: false
      },
      {
        id: 12,
        name: "micrometers",
        symbol: "µm",
        displayName: "micrometer(µm)",
        measurementType: {
          id: 1,
          name: "length"
        },
        isDefault: false
      },
      {
        id: 75,
        name: "miles",
        symbol: "mi",
        displayName: "miles (mi)",
        measurementType: {
          id: 18,
          name: "distance"
        },
        isDefault: false
      },
      {
        id: 25,
        name: "miles per hour",
        symbol: "mph",
        displayName: "miles per hour(mph)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 59,
        name: "milimeter per hour",
        symbol: "mm/hr",
        displayName: "milimeter per hour(mm/hr)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 73,
        name: "milimeter per second",
        symbol: "mm/second",
        displayName: "milimeter per second(mm/second)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: true
      },
      {
        id: 7,
        name: "milliliter",
        symbol: "ml",
        displayName: "milliliter(ml)",
        measurementType: {
          id: 3,
          name: "volume"
        },
        isDefault: false
      },
      {
        id: 1,
        name: "millimeters",
        symbol: "mm",
        displayName: "millimeter(mm)",
        measurementType: {
          id: 1,
          name: "length"
        },
        isDefault: false
      },
      {
        id: 13,
        name: "minute",
        symbol: "min",
        displayName: "minute",
        measurementType: {
          id: 6,
          name: "datetime"
        },
        isDefault: false
      },
      {
        id: 31,
        name: "newtons",
        symbol: "lb-ft",
        displayName: "newtons(lb-ft)",
        measurementType: {
          id: 2,
          name: "weight"
        },
        isDefault: false
      },
      {
        id: 32,
        name: "ounce",
        symbol: "oz",
        displayName: "ounce(oz)",
        measurementType: {
          id: 2,
          name: "weight"
        },
        isDefault: false
      },
      {
        id: 9,
        name: "percent",
        symbol: "%",
        displayName: "percent(%)",
        measurementType: {
          id: 8,
          name: "arithmetic - percentage"
        },
        isDefault: true
      },
      {
        id: 30,
        name: "pound",
        symbol: "lb",
        displayName: "pound(lb)",
        measurementType: {
          id: 2,
          name: "weight"
        },
        isDefault: false
      },
      {
        id: 46,
        name: "pounds per cubic inch",
        symbol: "lb/cu in",
        displayName: "pounds per cubic inch(lb/cu in)",
        measurementType: {
          id: 14,
          name: "density"
        },
        isDefault: false
      },
      {
        id: 34,
        name: "pounds per square inch",
        symbol: "psi",
        displayName: "pounds per square inch(psi)",
        measurementType: {
          id: 4,
          name: "pressure"
        },
        isDefault: false
      },
      {
        id: 19,
        name: "Ra (uin)",
        symbol: "Ra µin",
        displayName: "Ra(µin)",
        measurementType: {
          id: 10,
          name: "surface roughness"
        },
        isDefault: false
      },
      {
        id: 20,
        name: "Ra (um)",
        symbol: "Ra µm",
        displayName: "Ra(µm)",
        measurementType: {
          id: 10,
          name: "surface roughness"
        },
        isDefault: true
      },
      {
        id: 47,
        name: "resistance rating",
        symbol: "",
        displayName: "resistance rating",
        measurementType: {
          id: 11,
          name: "alphanumeric"
        },
        isDefault: false
      },
      {
        id: 27,
        name: "revolutions per minute",
        symbol: "rpm",
        displayName: "revolutions per minute(rpm)",
        measurementType: {
          id: 12,
          name: "velocity"
        },
        isDefault: false
      },
      {
        id: 35,
        name: "Rockwell Hardness",
        symbol: "",
        displayName: "Rockwell Hardness",
        measurementType: {
          id: 13,
          name: "hardness"
        },
        isDefault: false
      },
      {
        id: 36,
        name: "second",
        symbol: "sec",
        displayName: "second(sec)",
        measurementType: {
          id: 6,
          name: "datetime"
        },
        isDefault: true
      },
      {
        id: 37,
        name: "Shore Hardness A",
        symbol: "",
        displayName: "Shore Hardness A",
        measurementType: {
          id: 13,
          name: "hardness"
        },
        isDefault: false
      },
      {
        id: 38,
        name: "Shore Hardness D",
        symbol: "",
        displayName: "Shore Hardness D",
        measurementType: {
          id: 13,
          name: "hardness"
        },
        isDefault: false
      },
      {
        id: 39,
        name: "Shore Hardness OO",
        symbol: "",
        displayName: "Shore Hardness OO",
        measurementType: {
          id: 13,
          name: "hardness"
        },
        isDefault: false
      },
      {
        id: 68,
        name: "square centimeter per hour",
        symbol: "cm2/hr",
        displayName: "square centimeter per hour(cm2/hr)",
        measurementType: {
          id: 17,
          name: "area velocity"
        },
        isDefault: true
      },
      {
        id: 41,
        name: "square centimeters",
        symbol: "cm2",
        displayName: "square centimeter(cm2)",
        measurementType: {
          id: 9,
          name: "area"
        },
        isDefault: true
      },
      {
        id: 72,
        name: "square feet per hour",
        symbol: "ft2/hr",
        displayName: "square feet per hour(ft2/hr)",
        measurementType: {
          id: 17,
          name: "area velocity"
        },
        isDefault: false
      },
      {
        id: 42,
        name: "square foot",
        symbol: "ft2",
        displayName: "square foot(ft2)",
        measurementType: {
          id: 9,
          name: "area"
        },
        isDefault: false
      },
      {
        id: 43,
        name: "square inch",
        symbol: "in2",
        displayName: "square inch(in2)",
        measurementType: {
          id: 9,
          name: "area"
        },
        isDefault: false
      },
      {
        id: 71,
        name: "square inches per hour",
        symbol: "in2/hr",
        displayName: "square inches per hour(in2/hr)",
        measurementType: {
          id: 17,
          name: "area velocity"
        },
        isDefault: false
      },
      {
        id: 70,
        name: "square meter per hour",
        symbol: "m2/hr",
        displayName: "square meter per hour(m2/hr)",
        measurementType: {
          id: 17,
          name: "area velocity"
        },
        isDefault: false
      },
      {
        id: 44,
        name: "square meters",
        symbol: "m2",
        displayName: "square meter(m2)",
        measurementType: {
          id: 9,
          name: "area"
        },
        isDefault: false
      },
      {
        id: 54,
        name: "square micrometers",
        symbol: "µm2",
        displayName: "square micrometer(µm2)",
        measurementType: {
          id: 9,
          name: "area"
        },
        isDefault: false
      },
      {
        id: 69,
        name: "square millimeter per hour",
        symbol: "mm2/hr",
        displayName: "square millimeter per hour(mm2/hr)",
        measurementType: {
          id: 17,
          name: "area velocity"
        },
        isDefault: false
      },
      {
        id: 53,
        name: "square millimeters",
        symbol: "mm2",
        displayName: "square millimeter(mm2)",
        measurementType: {
          id: 9,
          name: "area"
        },
        isDefault: false
      },
      {
        id: 40,
        name: "Vickers Hardness",
        symbol: "",
        displayName: "Vickers Hardness",
        measurementType: {
          id: 13,
          name: "hardness"
        },
        isDefault: false
      },
      {
        id: 48,
        name: "watts",
        symbol: "W",
        displayName: "watts (W)",
        measurementType: {
          id: 15,
          name: "power"
        },
        isDefault: true
      }
    ]
  };
  constructor() { }

  ngOnInit() {
  }

  getPartDimension() {
    const metadataList =
      this.measurementUnits && this.measurementUnits.metadataList;
    return Util.getPartDimension(
      this.part.rfqMedia.media.partDimension,
      metadataList || []
    );
  }

  shippingAddressInfo(address: Address) {
    return Util.shippingAddressInfo(address);
  }
}
