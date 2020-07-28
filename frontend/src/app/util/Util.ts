import { HttpParams } from '@angular/common/http';

import { FilterOption } from '../model/vendor.model';
import {
  PartDimensionValue,
  PartCustomParameter,
  Address,
  AddressDelimiter,
  AppPartTypeEnum
} from '../model/part.model';
import { Part, PartDimension } from '../model/part.model';
import { PartQuote, PartQuoteCustomerView } from '../model/connect.model';

declare var require: any;
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

export class Util {
  static dateFormat = 'MM/dd/yyyy';
  static measurementUnit = 'mm';
  static hoursMinuteConverter = 'HH:mm';
  static dateFormatWithTime = 'MM/dd/yyyy hh:mm a';
  static PST = '-0800';

  static convertMinutesToDate(minutes: number): string {
    dayjs.extend(utc);
    return dayjs()
      .startOf('day')
      .add(minutes, 'minute')
      .format(Util.hoursMinuteConverter);
  }

  static dateDiff(dt: any, dt1: any, unit: any): string {
    const first = dayjs(dt);
    const second = dayjs(dt1);
    return Util.convertMinutesToDate(second.diff(first, unit));
  }

  static getPartDimension(dimension: PartDimension, measurements: any = []) {
    const arr = [];
    if (dimension.x && dimension.x.value) {
      const measurement = Util.findMeasurementUnit(measurements, dimension.x.unitId);
      arr.push(`${dimension.x.value} ${measurement}`);
    }
    if (dimension.y && dimension.y.value) {
      const measurement = Util.findMeasurementUnit(measurements, dimension.y.unitId);
      arr.push(`${dimension.y.value} ${measurement}`);
    }
    if (dimension.z && dimension.z.value) {
      const measurement = Util.findMeasurementUnit(measurements, dimension.z.unitId);
      arr.push(`${dimension.z.value} ${measurement}`);
    }
    return arr.join(' x ');
  }

  static getPartDimensionValue(dimensionValue: PartDimensionValue, measurements: any = []) {
    if (dimensionValue && dimensionValue.value) {
      const measurement = Util.findMeasurementUnit(measurements, dimensionValue.unitId);
      return `${dimensionValue.value} ${measurement}`;
    }
    return '';
  }

  static getBoundingBox(dimension: PartDimension, measurements: any = []) {
    if (
      dimension &&
      dimension.x &&
      dimension.x.value &&
      dimension.y &&
      dimension.y.value &&
      dimension.z &&
      dimension.z.value
    ) {
      const measurement = Util.findMeasurementUnit(measurements, dimension.x.unitId);
      return `${(dimension.x.value * dimension.y.value * dimension.z.value).toFixed(2)} cubic ${measurement}`;
    }
    return '';
  }

  static shippingAddressInfo(address: Address, delimiter: AddressDelimiter = AddressDelimiter.HTML_LINE_BREAK) {
    if (!address) {
      return '-';
    }
    return [
      address.street1 || address.street2 || '',
      `${address.city || ''}`,
      `${address.zipcode || ''}`,
      address.country.name
    ]
      .filter(i => i.toString().trim() !== '')
      .join(delimiter);
  }

  static showCustomPrameter(customParameter: PartCustomParameter, measurements: any = [], operatorTypes: any = []) {
    let string = ``;
    if (customParameter.targetValue && customParameter.targetUnitTypeId) {
      const measurement = Util.findMeasurementUnit(measurements, customParameter.targetUnitTypeId);
      string += `${customParameter.targetValue} ${measurement}`;
    }
    if (customParameter.parameterTolerance) {
      const measurement = Util.findMeasurementUnit(measurements, customParameter.parameterTolerance.unitTypeId);
      string += `+/- ${customParameter.parameterTolerance.value} ${measurement}`;
    } else {
      const operatorType = Util.findMeasurementUnit(operatorTypes, customParameter.targetOperatorTypeId);
      string = `${operatorType} ${string}`;
    }
    return string;
  }

  static findMeasurementUnit(measurements: any, unitId: number): any {
    const m = (measurements || []).find(item => item.id === unitId);
    return m ? m.symbol || m.name : Util.measurementUnit;
  }

  static calcShippingCost(parts: Array<Part>) {
    return (parts || []).reduce((accumulator, value) => {
      accumulator += value.shippingCost || 0;
      return accumulator;
    }, 0);
  }

  static preparePostProcessValues(process: any, arr: Array<number>): string {
    let value = '';
    const filterPostProcessAction = process.filter(item => arr.includes(item.id));
    if (filterPostProcessAction.length) {
      filterPostProcessAction.map((item, index) => {
        if (index != filterPostProcessAction.length - 1) {
          value += item.name + ', ';
        } else {
          value += item.name;
        }
      });
    }
    return value;
  }

  static parseUtcDateTime(value: any, format: string = 'MM/DD/YYYY HH:mm:ss'): any {
    dayjs.extend(utc);
    return value ? dayjs.utc(value).format(format) : '';
  }

  static hasJson(value: any) {
    if (typeof value !== 'string') {
      return false;
    }
    try {
      const result = JSON.parse(value);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }

  static extendUtcDate(value: any): any {
    dayjs.extend(utc);
    return value ? dayjs.utc(value).toDate() : null;
  }

  static getDateRange() {
    const today = dayjs();
    const startDate = today.subtract(30, 'day');
    return [Util.extendUtcDate(startDate), Util.extendUtcDate(today)];
  }

  static isUserAuthenticated() {
    let alreadyAuthenticated = false;
    const resultStr = localStorage.getItem('admin-userAuthenticated');
    if (resultStr) {
      const result = JSON.parse(resultStr);
      if (result.authenticated && new Date().getTime() < result.expiryTime) {
        alreadyAuthenticated = true;
      } else {
        localStorage.setItem('admin-userAuthenticated', '');
      }
    }
    return alreadyAuthenticated;
  }

  static isProposalPart(part: Part): boolean {
    return (
      part.partType.name === AppPartTypeEnum.PRODUCTION_PROPOSAL_PART ||
      part.partType.name === AppPartTypeEnum.CONNECT_PROPOSAL_PART
    );
  }

  static buildParameters(filter: FilterOption): HttpParams {
    let params = new HttpParams();
    if (filter) {
      params = params.append('page', filter.page.toString());
      params = params.append('size', filter.size.toString());
      if (filter.sort) {
        params = params.append('sort', filter.sort.toString());
      }
    }
    return params;
  }

  static compareDate(date1: Date, date2: Date): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const same = d1.getTime() === d2.getTime();

    // Check if the first is greater than second
    if (same) {
      return 0;
    }

    // Check if the first is greater than second
    if (d1 > d2) {
      return 1;
    }

    // Check if the first is less than second
    if (d1 < d2) {
      return -1;
    }
  }

  static calcPartQuoteCost(quote: PartQuoteCustomerView): number {
    const itemCost = (quote.partQuoteDetails || []).reduce((sum: number, item: PartQuote) => {
      sum += Number(item.unit) * Number(item.unitPrice || 0);
      return sum;
    }, 0);

    return Number(itemCost || 0) + Number(quote.marginCost || 0);
  }
}
