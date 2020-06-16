import { PartDimensionValue, PartCustomParameter, Address } from '../model/part.model';
import { Part, PartDimension } from '../model/part.model';

declare var require: any;
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

export class Util {
  static dateFormat = 'MM/dd/yyyy';
  static measurementUnit = 'mm';
  static hoursMinuteConverter = 'HH:mm';
  static dateFormatWithTime = 'MM/dd/yyyy hh:mm a';

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

  static shippingAddressInfo(address: Address) {
    if (!address) {
      return '-';
    }
    return [
      address.street1 || address.street2 || '',
      `${address.city || ''} ${address.zipcode || ''}`,
      address.country.name
    ]
      .filter(i => i.toString().trim() !== '')
      .join(', ');
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

  static parseUtcDateTime(value: any): any {
    dayjs.extend(utc);
    return value ? dayjs.utc(value).format('MM/DD/YYYY HH:mm:ss') : '';
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
}
