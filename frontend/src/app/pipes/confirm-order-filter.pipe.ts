import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'confirmOrderFilter'
})
export class ConfirmOrderFilterPipe implements PipeTransform {
  transform(parts: any, statusId: string, id: number): any {
    if (!((parts || []).length > 0)) {
      return [];
    }
    return statusId || id
      ? parts.filter(item => {
          return (
            item &&
            ((id && item.bidOrder.id === Number(id)) ||
              (statusId && item.bidOrder.bidOrderStatusType.id === Number(statusId)))
          );
        })
      : parts;
  }
}
