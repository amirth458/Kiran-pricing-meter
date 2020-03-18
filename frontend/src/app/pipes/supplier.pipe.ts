import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'supplier'
})
export class SupplierPipe implements PipeTransform {
  transform(arr: any, blockedSuppliers: Array<number>, value: boolean): any {
    if ((arr || []).length === 0) {
      return [];
    }
    return (arr || []).filter(row => (blockedSuppliers || []).indexOf(row.vendorId) > -1 === value);
  }
}
