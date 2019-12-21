import { PartDimensionValue, PartCustomParameter } from "./../model/part.model";
import { Part, PartDimension } from "../model/part.model";

export class Util {
  static dateFormat = "MM/dd/yyyy";
  static measurementUnit = "mm";

  static getPartDimension(dimension: PartDimension, measurements: any = []) {
    const arr = [];
    if (dimension.x && dimension.x.value) {
      const measurement = Util.findMeasurementUnit(
        measurements,
        dimension.x.unitId
      );
      arr.push(`${dimension.x.value} ${measurement}`);
    }
    if (dimension.y && dimension.y.value) {
      const measurement = Util.findMeasurementUnit(
        measurements,
        dimension.y.unitId
      );
      arr.push(`${dimension.y.value} ${measurement}`);
    }
    if (dimension.z && dimension.z.value) {
      const measurement = Util.findMeasurementUnit(
        measurements,
        dimension.z.unitId
      );
      arr.push(`${dimension.z.value} ${measurement}`);
    }
    return arr.join(" x ");
  }

  static getPartDimensionValue(
    dimensionValue: PartDimensionValue,
    measurements: any = []
  ) {
    if (dimensionValue && dimensionValue.value) {
      const measurement = Util.findMeasurementUnit(
        measurements,
        dimensionValue.unitId
      );
      return `${dimensionValue.value} ${measurement}`;
    }
    return "";
  }

  static getBoundingBox(dimension: PartDimension, measurements: any = []) {
    if (
      dimension.x &&
      dimension.x.value &&
      dimension.y &&
      dimension.y.value &&
      dimension.z &&
      dimension.z.value
    ) {
      const measurement = Util.findMeasurementUnit(
        measurements,
        dimension.x.unitId
      );
      return `${dimension.x.value *
        dimension.y.value *
        dimension.z.value} cubic ${measurement}`;
    }
    return "";
  }

  static showCustomPrameter(
    customParameter: PartCustomParameter,
    measurements: any = []
  ) {
    let string = ``;
    if (customParameter.targetValue && customParameter.targetUnitTypeId) {
      const measurement = Util.findMeasurementUnit(
        measurements,
        customParameter.targetUnitTypeId
      );
      string += `${customParameter.targetValue} ${measurement}`;
    }
    if (customParameter.parameterTolerance) {
      const measurement = Util.findMeasurementUnit(
        measurements,
        customParameter.parameterTolerance.unitTypeId
      );
      string += `+/- ${customParameter.parameterTolerance.value} ${measurement}`;
    }
  }

  static findMeasurementUnit(measurements: any, unitId: number): any {
    const m = (measurements || []).find(item => item.id === unitId);
    return (m || []).length > 0 ? m[0].symbol : Util.measurementUnit;
  }

  static calcShippingCost(parts: Array<Part>) {
    return (parts || []).reduce((accumulator, value) => {
      accumulator += value.shippingCost || 0;
      return accumulator;
    }, 0);
  }
}
