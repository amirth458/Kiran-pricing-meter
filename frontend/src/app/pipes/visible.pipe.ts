import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'visible',
  pure: false
})
export class VisiblePipe implements PipeTransform {
  transform(value: any[], prop: string, val: any): any {
    prop = prop || 'visible';
    if (!((value || []).length > 0)) {
      return [];
    }
    return val
      ? value.filter(item => {
          return item[prop] == val;
        })
      : value;
  }
}
