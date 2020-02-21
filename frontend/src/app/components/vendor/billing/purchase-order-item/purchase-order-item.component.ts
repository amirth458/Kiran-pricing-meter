import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BillingService } from 'src/app/service/billing.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-purchase-order-item',
  templateUrl: './purchase-order-item.component.html',
  styleUrls: ['./purchase-order-item.component.css']
})
export class PurchaseOrderItemComponent implements OnInit {

  chatForm = this.fb.group({
    note: ['', Validators.required]
  });
  messageList = [];
  showPaymentDetails = false;
  selectedPurchaseOrderId = null;

  userInfo;
  orderInfo;
  postProcessAction = [];
  // = {
  //   billingInfoView: {
  //     id: 4,
  //     orderId: 75,
  //     userId: 133,
  //     amount: 0.00,
  //     guid: null,
  //     status: null,
  //     paymentType: "PURCHASE_ORDER",
  //     creditCard: null,
  //     purchaseAgreement: {
  //       id: 4,
  //       poaNumber: "1234xyz",
  //       purchaseAgreementNoteViewList: [
  //         {
  //           id: 8,
  //           note: "test note",
  //           guid: null
  //         }
  //       ],
  //       guid: null,
  //       resourceUrl: null,
  //       status: "Pending"
  //     }
  //   },
  //   customerOrder: {
  //     id: 75,
  //     customerId: 133,
  //     vendorOrderId: null,
  //     orderStatusType: {
  //       id: 4,
  //       name: null,
  //       description: "ORDER PENDING"
  //     },
  //     paymentStatusType: {
  //       id: 1,
  //       name: "WAITING_FOR_APPROVAL",
  //       description: "WAITING FOR APPROVAL"
  //     },
  //     isArchived: false,
  //     partList: [
  //       {
  //         id: 960,
  //         name: null,
  //         rfqMedia: {
  //           id: 1069,
  //           projectRfqId: 974,
  //           media: {
  //             id: 1810,
  //             name: "jaw-original.stp",
  //             uploadedAt: "2020-01-20T18:32:21.636+0000",
  //             connectorServiceId: 2780,
  //             fileType: {
  //               id: 5,
  //               name: "stp",
  //               description: "stp"
  //             },
  //             location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2020/01/20/2020-01-20_18-32-21-procurement_1331486822532627208122jaw-original.stp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=d110a2fccdaf9ca19026771092012d46e74dd1e9fe602873fc0ab1560f162504",
  //             customerId: 133,
  //             partDimension: {
  //               id: 1512,
  //               name: "jaw-original.stp",
  //               x: {
  //                 value: 0.07757,
  //                 valueInDefaultUnit: 7.75700,
  //                 unitId: 3
  //               },
  //               y: {
  //                 value: 0.02515,
  //                 valueInDefaultUnit: 2.51500,
  //                 unitId: 3
  //               },
  //               z: {
  //                 value: 0.03400,
  //                 valueInDefaultUnit: 3.40000,
  //                 unitId: 3
  //               },
  //               volume: {
  //                 value: 0.0000295365,
  //                 valueInDefaultUnit: 0.0029536500,
  //                 unitId: 3
  //               },
  //               surfaceArea: {
  //                 value: 0.0097780804,
  //                 valueInDefaultUnit: 0.9778080400,
  //                 unitId: 3
  //               },
  //               thumbnail100Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/e5a5547a-459e-456a-8410-288c77a8ed1f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=8653b6c7d55c0024017c338c07767c62a95a5c893355bdad2518fbf278a84b46",
  //               thumbnail200Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/b11a5a3e-fdde-455a-8ab1-0ea81e850658.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b59ccb36b6a2504f15eee91f1c00de8f15abf789f0bd32b582e3c690cc6f13eb",
  //               thumbnail400Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/5654d80e-773f-4382-8a3f-fd8aa739dc7f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=6476c3b04b9cdf6d15544b65892e4382f4170317e99cfe0475b0788dbc4e95b0",
  //               partDimensionStatusType: {
  //                 id: 2,
  //                 name: "COMPLETED",
  //                 description: "COMPLETED"
  //               },
  //               mediaId: 1810
  //             }
  //           },
  //           partList: null
  //         },
  //         materialPropertyType: "NAME",
  //         materialPropertyValues: [
  //           "3D Systems Accura CastPro"
  //         ],
  //         equipmentPropertyType: "PROCESS_TYPE",
  //         equipmentPropertyValues: [
  //           "Casting"
  //         ],
  //         materialIds: [
  //           34
  //         ],
  //         equipmentIds: [
  //           230,
  //           290,
  //           238,
  //           242,
  //           225,
  //           221,
  //           269,
  //           273,
  //           226,
  //           293,
  //           354,
  //           555,
  //           291
  //         ],
  //         cuttingBondingAllowed: null,
  //         quantity: 4,
  //         targetDeliveryDate: "2020-01-24T00:00:00.000+0000",
  //         shippingCost: null,
  //         shippedAt: null,
  //         manualPricingAllowed: true,
  //         shippingAddress: {
  //           id: 32,
  //           name: null,
  //           street1: "128 Sierra Street",
  //           street2: null,
  //           landmark: null,
  //           city: "El Segundo",
  //           zipcode: "90245",
  //           state: "CA",
  //           customerId: 133,
  //           country: {
  //             id: 232,
  //             name: "United States"
  //           },
  //           primary: true,
  //           addressType: {
  //             id: 1,
  //             addressType: "SHIPPING_ADDRESS"
  //           }
  //         },
  //         partStatusType: {
  //           id: 13,
  //           name: null,
  //           description: "PAYMENT PENDING",
  //           displayName: "Payment Pending",
  //           display: false
  //         },
  //         order: {
  //           id: 75,
  //           customerId: null,
  //           vendorOrderId: null,
  //           orderStatusType: {
  //             id: 4,
  //             name: null,
  //             description: "ORDER PENDING"
  //           },
  //           paymentStatusType: {
  //             id: 1,
  //             name: "WAITING_FOR_APPROVAL",
  //             description: "WAITING FOR APPROVAL"
  //           },
  //           isArchived: null,
  //           partList: null
  //         },
  //         postProcessTypeIds: [],
  //         partCustomParameterList: [
  //           {
  //             id: 396,
  //             targetValue: 3.00000,
  //             targetOperatorTypeId: 1,
  //             targetUnitTypeId: 4,
  //             partParameterType: {
  //               id: 3,
  //               name: "Primary_Length",
  //               description: "Primary Length"
  //             },
  //             partId: 960,
  //             parameterTolerance: {
  //               id: 245,
  //               value: 4.00000,
  //               valueSignTypeId: 1,
  //               unitTypeId: 4,
  //               partCustomParameterId: 396
  //             }
  //           },
  //           {
  //             id: 395,
  //             targetValue: 4.00000,
  //             targetOperatorTypeId: 4,
  //             targetUnitTypeId: 20,
  //             partParameterType: {
  //               id: 1,
  //               name: "SURFACE_ROUGHNESS",
  //               description: "SURFACE_ROUGHNESS"
  //             },
  //             partId: 960,
  //             parameterTolerance: null
  //           }
  //         ],
  //         expiredAt: "2020-02-19T05:56:55.211+0000"
  //       }
  //       ,
  //       {
  //         id: 960,
  //         name: null,
  //         rfqMedia: {
  //           id: 1069,
  //           projectRfqId: 974,
  //           media: {
  //             id: 1810,
  //             name: "jaw-original.stp",
  //             uploadedAt: "2020-01-20T18:32:21.636+0000",
  //             connectorServiceId: 2780,
  //             fileType: {
  //               id: 5,
  //               name: "stp",
  //               description: "stp"
  //             },
  //             location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2020/01/20/2020-01-20_18-32-21-procurement_1331486822532627208122jaw-original.stp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=d110a2fccdaf9ca19026771092012d46e74dd1e9fe602873fc0ab1560f162504",
  //             customerId: 133,
  //             partDimension: {
  //               id: 1512,
  //               name: "jaw-original.stp",
  //               x: {
  //                 value: 0.07757,
  //                 valueInDefaultUnit: 7.75700,
  //                 unitId: 3
  //               },
  //               y: {
  //                 value: 0.02515,
  //                 valueInDefaultUnit: 2.51500,
  //                 unitId: 3
  //               },
  //               z: {
  //                 value: 0.03400,
  //                 valueInDefaultUnit: 3.40000,
  //                 unitId: 3
  //               },
  //               volume: {
  //                 value: 0.0000295365,
  //                 valueInDefaultUnit: 0.0029536500,
  //                 unitId: 3
  //               },
  //               surfaceArea: {
  //                 value: 0.0097780804,
  //                 valueInDefaultUnit: 0.9778080400,
  //                 unitId: 3
  //               },
  //               thumbnail100Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/e5a5547a-459e-456a-8410-288c77a8ed1f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=8653b6c7d55c0024017c338c07767c62a95a5c893355bdad2518fbf278a84b46",
  //               thumbnail200Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/b11a5a3e-fdde-455a-8ab1-0ea81e850658.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b59ccb36b6a2504f15eee91f1c00de8f15abf789f0bd32b582e3c690cc6f13eb",
  //               thumbnail400Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/5654d80e-773f-4382-8a3f-fd8aa739dc7f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=6476c3b04b9cdf6d15544b65892e4382f4170317e99cfe0475b0788dbc4e95b0",
  //               partDimensionStatusType: {
  //                 id: 2,
  //                 name: "COMPLETED",
  //                 description: "COMPLETED"
  //               },
  //               mediaId: 1810
  //             }
  //           },
  //           partList: null
  //         },
  //         materialPropertyType: "NAME",
  //         materialPropertyValues: [
  //           "3D Systems Accura CastPro"
  //         ],
  //         equipmentPropertyType: "PROCESS_TYPE",
  //         equipmentPropertyValues: [
  //           "Casting"
  //         ],
  //         materialIds: [
  //           34
  //         ],
  //         equipmentIds: [
  //           230,
  //           290,
  //           238,
  //           242,
  //           225,
  //           221,
  //           269,
  //           273,
  //           226,
  //           293,
  //           354,
  //           555,
  //           291
  //         ],
  //         cuttingBondingAllowed: null,
  //         quantity: 4,
  //         targetDeliveryDate: "2020-01-24T00:00:00.000+0000",
  //         shippingCost: null,
  //         shippedAt: 2 / 2 / 2020,
  //         manualPricingAllowed: true,
  //         shippingAddress: {
  //           id: 32,
  //           name: null,
  //           street1: "128 Sierra Street",
  //           street2: null,
  //           landmark: null,
  //           city: "El Segundo",
  //           zipcode: "90245",
  //           state: "CA",
  //           customerId: 133,
  //           country: {
  //             id: 232,
  //             name: "United States"
  //           },
  //           primary: true,
  //           addressType: {
  //             id: 1,
  //             addressType: "SHIPPING_ADDRESS"
  //           }
  //         },
  //         partStatusType: {
  //           id: 13,
  //           name: null,
  //           description: "PAYMENT PENDING",
  //           displayName: "Payment Pending",
  //           display: false
  //         },
  //         order: {
  //           id: 75,
  //           customerId: null,
  //           vendorOrderId: null,
  //           orderStatusType: {
  //             id: 4,
  //             name: null,
  //             description: "ORDER PENDING"
  //           },
  //           paymentStatusType: {
  //             id: 1,
  //             name: "WAITING_FOR_APPROVAL",
  //             description: "WAITING FOR APPROVAL"
  //           },
  //           isArchived: null,
  //           partList: null
  //         },
  //         postProcessTypeIds: [],
  //         partCustomParameterList: [
  //           {
  //             id: 396,
  //             targetValue: 3.00000,
  //             targetOperatorTypeId: 1,
  //             targetUnitTypeId: 4,
  //             partParameterType: {
  //               id: 3,
  //               name: "Primary_Length",
  //               description: "Primary Length"
  //             },
  //             partId: 960,
  //             parameterTolerance: {
  //               id: 245,
  //               value: 4.00000,
  //               valueSignTypeId: 1,
  //               unitTypeId: 4,
  //               partCustomParameterId: 396
  //             }
  //           },
  //           {
  //             id: 395,
  //             targetValue: 4.00000,
  //             targetOperatorTypeId: 4,
  //             targetUnitTypeId: 20,
  //             partParameterType: {
  //               id: 1,
  //               name: "SURFACE_ROUGHNESS",
  //               description: "SURFACE_ROUGHNESS"
  //             },
  //             partId: 960,
  //             parameterTolerance: null
  //           }
  //         ],
  //         expiredAt: "2020-02-19T05:56:55.211+0000"
  //       },
  //       {
  //         id: 960,
  //         name: null,
  //         rfqMedia: {
  //           id: 1069,
  //           projectRfqId: 974,
  //           media: {
  //             id: 1810,
  //             name: "jaw-original.stp",
  //             uploadedAt: "2020-01-20T18:32:21.636+0000",
  //             connectorServiceId: 2780,
  //             fileType: {
  //               id: 5,
  //               name: "stp",
  //               description: "stp"
  //             },
  //             location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2020/01/20/2020-01-20_18-32-21-procurement_1331486822532627208122jaw-original.stp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=d110a2fccdaf9ca19026771092012d46e74dd1e9fe602873fc0ab1560f162504",
  //             customerId: 133,
  //             partDimension: {
  //               id: 1512,
  //               name: "jaw-original.stp",
  //               x: {
  //                 value: 0.07757,
  //                 valueInDefaultUnit: 7.75700,
  //                 unitId: 3
  //               },
  //               y: {
  //                 value: 0.02515,
  //                 valueInDefaultUnit: 2.51500,
  //                 unitId: 3
  //               },
  //               z: {
  //                 value: 0.03400,
  //                 valueInDefaultUnit: 3.40000,
  //                 unitId: 3
  //               },
  //               volume: {
  //                 value: 0.0000295365,
  //                 valueInDefaultUnit: 0.0029536500,
  //                 unitId: 3
  //               },
  //               surfaceArea: {
  //                 value: 0.0097780804,
  //                 valueInDefaultUnit: 0.9778080400,
  //                 unitId: 3
  //               },
  //               thumbnail100Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/e5a5547a-459e-456a-8410-288c77a8ed1f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=8653b6c7d55c0024017c338c07767c62a95a5c893355bdad2518fbf278a84b46",
  //               thumbnail200Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/b11a5a3e-fdde-455a-8ab1-0ea81e850658.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b59ccb36b6a2504f15eee91f1c00de8f15abf789f0bd32b582e3c690cc6f13eb",
  //               thumbnail400Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/5654d80e-773f-4382-8a3f-fd8aa739dc7f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=6476c3b04b9cdf6d15544b65892e4382f4170317e99cfe0475b0788dbc4e95b0",
  //               partDimensionStatusType: {
  //                 id: 2,
  //                 name: "COMPLETED",
  //                 description: "COMPLETED"
  //               },
  //               mediaId: 1810
  //             }
  //           },
  //           partList: null
  //         },
  //         materialPropertyType: "NAME",
  //         materialPropertyValues: [
  //           "3D Systems Accura CastPro"
  //         ],
  //         equipmentPropertyType: "PROCESS_TYPE",
  //         equipmentPropertyValues: [
  //           "Casting"
  //         ],
  //         materialIds: [
  //           34
  //         ],
  //         equipmentIds: [
  //           230,
  //           290,
  //           238,
  //           242,
  //           225,
  //           221,
  //           269,
  //           273,
  //           226,
  //           293,
  //           354,
  //           555,
  //           291
  //         ],
  //         cuttingBondingAllowed: null,
  //         quantity: 4,
  //         targetDeliveryDate: "2020-01-24T00:00:00.000+0000",
  //         shippingCost: null,
  //         shippedAt: null,
  //         manualPricingAllowed: true,
  //         shippingAddress: {
  //           id: 32,
  //           name: null,
  //           street1: "128 Sierra Street",
  //           street2: null,
  //           landmark: null,
  //           city: "El Segundo",
  //           zipcode: "90245",
  //           state: "CA",
  //           customerId: 133,
  //           country: {
  //             id: 232,
  //             name: "United States"
  //           },
  //           primary: true,
  //           addressType: {
  //             id: 1,
  //             addressType: "SHIPPING_ADDRESS"
  //           }
  //         },
  //         partStatusType: {
  //           id: 13,
  //           name: null,
  //           description: "PAYMENT PENDING",
  //           displayName: "Payment Pending",
  //           display: false
  //         },
  //         order: {
  //           id: 75,
  //           customerId: null,
  //           vendorOrderId: null,
  //           orderStatusType: {
  //             id: 4,
  //             name: null,
  //             description: "ORDER PENDING"
  //           },
  //           paymentStatusType: {
  //             id: 1,
  //             name: "WAITING_FOR_APPROVAL",
  //             description: "WAITING FOR APPROVAL"
  //           },
  //           isArchived: null,
  //           partList: null
  //         },
  //         postProcessTypeIds: [],
  //         partCustomParameterList: [
  //           {
  //             id: 396,
  //             targetValue: 3.00000,
  //             targetOperatorTypeId: 1,
  //             targetUnitTypeId: 4,
  //             partParameterType: {
  //               id: 3,
  //               name: "Primary_Length",
  //               description: "Primary Length"
  //             },
  //             partId: 960,
  //             parameterTolerance: {
  //               id: 245,
  //               value: 4.00000,
  //               valueSignTypeId: 1,
  //               unitTypeId: 4,
  //               partCustomParameterId: 396
  //             }
  //           },
  //           {
  //             id: 395,
  //             targetValue: 4.00000,
  //             targetOperatorTypeId: 4,
  //             targetUnitTypeId: 20,
  //             partParameterType: {
  //               id: 1,
  //               name: "SURFACE_ROUGHNESS",
  //               description: "SURFACE_ROUGHNESS"
  //             },
  //             partId: 960,
  //             parameterTolerance: null
  //           }
  //         ],
  //         expiredAt: "2020-02-19T05:56:55.211+0000"
  //       }, {
  //         id: 960,
  //         name: null,
  //         rfqMedia: {
  //           id: 1069,
  //           projectRfqId: 974,
  //           media: {
  //             id: 1810,
  //             name: "jaw-original.stp",
  //             uploadedAt: "2020-01-20T18:32:21.636+0000",
  //             connectorServiceId: 2780,
  //             fileType: {
  //               id: 5,
  //               name: "stp",
  //               description: "stp"
  //             },
  //             location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/2/2020/01/20/2020-01-20_18-32-21-procurement_1331486822532627208122jaw-original.stp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=d110a2fccdaf9ca19026771092012d46e74dd1e9fe602873fc0ab1560f162504",
  //             customerId: 133,
  //             partDimension: {
  //               id: 1512,
  //               name: "jaw-original.stp",
  //               x: {
  //                 value: 0.07757,
  //                 valueInDefaultUnit: 7.75700,
  //                 unitId: 3
  //               },
  //               y: {
  //                 value: 0.02515,
  //                 valueInDefaultUnit: 2.51500,
  //                 unitId: 3
  //               },
  //               z: {
  //                 value: 0.03400,
  //                 valueInDefaultUnit: 3.40000,
  //                 unitId: 3
  //               },
  //               volume: {
  //                 value: 0.0000295365,
  //                 valueInDefaultUnit: 0.0029536500,
  //                 unitId: 3
  //               },
  //               surfaceArea: {
  //                 value: 0.0097780804,
  //                 valueInDefaultUnit: 0.9778080400,
  //                 unitId: 3
  //               },
  //               thumbnail100Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/e5a5547a-459e-456a-8410-288c77a8ed1f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=8653b6c7d55c0024017c338c07767c62a95a5c893355bdad2518fbf278a84b46",
  //               thumbnail200Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/b11a5a3e-fdde-455a-8ab1-0ea81e850658.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b59ccb36b6a2504f15eee91f1c00de8f15abf789f0bd32b582e3c690cc6f13eb",
  //               thumbnail400Location: "https://3diligent-connector-dev.s3.us-west-2.amazonaws.com/0/2020/01/20/2020-01-20_18-32-59-2780/5654d80e-773f-4382-8a3f-fd8aa739dc7f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200122T013941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAXDHQUQPKFHB64HM4%2F20200122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=6476c3b04b9cdf6d15544b65892e4382f4170317e99cfe0475b0788dbc4e95b0",
  //               partDimensionStatusType: {
  //                 id: 2,
  //                 name: "COMPLETED",
  //                 description: "COMPLETED"
  //               },
  //               mediaId: 1810
  //             }
  //           },
  //           partList: null
  //         },
  //         materialPropertyType: "NAME",
  //         materialPropertyValues: [
  //           "3D Systems Accura CastPro"
  //         ],
  //         equipmentPropertyType: "PROCESS_TYPE",
  //         equipmentPropertyValues: [
  //           "Casting"
  //         ],
  //         materialIds: [
  //           34
  //         ],
  //         equipmentIds: [
  //           230,
  //           290,
  //           238,
  //           242,
  //           225,
  //           221,
  //           269,
  //           273,
  //           226,
  //           293,
  //           354,
  //           555,
  //           291
  //         ],
  //         cuttingBondingAllowed: null,
  //         quantity: 4,
  //         targetDeliveryDate: "2020-01-24T00:00:00.000+0000",
  //         shippingCost: null,
  //         shippedAt: null,
  //         manualPricingAllowed: true,
  //         shippingAddress: {
  //           id: 32,
  //           name: null,
  //           street1: "128 Sierra Street",
  //           street2: null,
  //           landmark: null,
  //           city: "El Segundo",
  //           zipcode: "90245",
  //           state: "CA",
  //           customerId: 133,
  //           country: {
  //             id: 232,
  //             name: "United States"
  //           },
  //           primary: true,
  //           addressType: {
  //             id: 1,
  //             addressType: "SHIPPING_ADDRESS"
  //           }
  //         },
  //         partStatusType: {
  //           id: 13,
  //           name: null,
  //           description: "PAYMENT PENDING",
  //           displayName: "Payment Pending",
  //           display: false
  //         },
  //         order: {
  //           id: 75,
  //           customerId: null,
  //           vendorOrderId: null,
  //           orderStatusType: {
  //             id: 4,
  //             name: null,
  //             description: "ORDER PENDING"
  //           },
  //           paymentStatusType: {
  //             id: 1,
  //             name: "WAITING_FOR_APPROVAL",
  //             description: "WAITING FOR APPROVAL"
  //           },
  //           isArchived: null,
  //           partList: null
  //         },
  //         postProcessTypeIds: [],
  //         partCustomParameterList: [
  //           {
  //             id: 396,
  //             targetValue: 3.00000,
  //             targetOperatorTypeId: 1,
  //             targetUnitTypeId: 4,
  //             partParameterType: {
  //               id: 3,
  //               name: "Primary_Length",
  //               description: "Primary Length"
  //             },
  //             partId: 960,
  //             parameterTolerance: {
  //               id: 245,
  //               value: 4.00000,
  //               valueSignTypeId: 1,
  //               unitTypeId: 4,
  //               partCustomParameterId: 396
  //             }
  //           },
  //           {
  //             id: 395,
  //             targetValue: 4.00000,
  //             targetOperatorTypeId: 4,
  //             targetUnitTypeId: 20,
  //             partParameterType: {
  //               id: 1,
  //               name: "SURFACE_ROUGHNESS",
  //               description: "SURFACE_ROUGHNESS"
  //             },
  //             partId: 960,
  //             parameterTolerance: null
  //           }
  //         ],
  //         expiredAt: "2020-02-19T05:56:55.211+0000"
  //       }
  //     ]
  //   }
  // };
  constructor(
    public toast: ToastrService,
    public location: Location,
    public modalService: NgbModal,
    public route: Router,
    public billingService: BillingService,
    public fb: FormBuilder,
    public userService: UserService,
    public spinner: NgxSpinnerService
  ) {
    this.selectedPurchaseOrderId = this.route.url.split('/').pop();
    this.userInfo = this.userService.getUserInfo();
  }

  ngOnInit() {

    this.spinner.show();
    // '75'
    this.billingService.getPaymentInfo(this.selectedPurchaseOrderId).subscribe(
      (res) => {
        console.log({ res });
        this.orderInfo = res;
        if (
          this.orderInfo &&
          this.orderInfo.billingInfoView &&
          this.orderInfo.billingInfoView.purchaseAgreement) {

        }
        this.messageList = this.orderInfo.billingInfoView.purchaseAgreement.purchaseAgreementNoteViewList || [];
        this.messageList = this.messageList.reverse();
        this.spinner.hide();
      },
      (err) => {
        console.log({ err });
        this.spinner.hide();
        this.toast.error(err.error.message);
        this.route.navigateByUrl('/billing/payment');
      });
  }

  open(content, size: any = 'lg') {
    this.modalService
      .open(content, {
        size,
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      })
      .result.then(
        result => { },
        reason => { }
      );
  }

  togglePaymentInfo() {
    this.showPaymentDetails = !this.showPaymentDetails;
  }

  approvePurchase() {
    this.toast.warning('Feature in progress');
    // this.toast.success('Purchase ' + this.selectedPurchaseOrderId + ' Approved.');
    this.modalService.dismissAll();
    this.location.back();
  }

  rejectPurchase() {
    this.toast.warning('Feature in progress');
    // this.toast.success('Purchase ' + this.selectedPurchaseOrderId + ' Rejected.');
    this.modalService.dismissAll();
    this.location.back();
  }

  formatPaymentType(paymentType: string) {
    return paymentType ? paymentType.replace('_', ' ') : '';
  }

  sendNote() {
    if (!this.chatForm.valid) {
      this.toast.warning('Please enter note to send');
      return;
    }

    this.billingService.addNote(this.chatForm.value.note, this.orderInfo.billingInfoView.orderId)
      .subscribe(
        (res) => {
          console.log({ res });
          this.messageList = res.reverse();
          this.toast.success('Note Sent');
          this.chatForm.reset();
        },
        (err) => {
          console.log({ err });
          this.toast.error(err.error.message);
        });

  }

  getpostProcessActionName(postProcessActionId: string) {

  }

  isDifferentDate(index: number) {
    if (index == 0) {
      return false;
    }
    const current = this.messageList[index].createdDate;
    const prev = this.messageList[index - 1].createdDate;
    if (!current || !prev) {
      return false;
    }

    const currentDate = new Date(this.messageList[index].createdDate);
    const prevDate = new Date(this.messageList[index - 1].createdDate);

    if (
      (currentDate.getDate() == prevDate.getDate()) &&
      (currentDate.getDate() == prevDate.getDate()) &&
      (currentDate.getDate() == prevDate.getDate())
    ) {
      return true;
    }

    return false;
  }
}
