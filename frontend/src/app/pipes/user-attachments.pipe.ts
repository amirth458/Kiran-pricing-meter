import { Pipe, PipeTransform } from '@angular/core';

import { ChatAttachment } from '../model/chat.model';

@Pipe({
  name: 'userAttachments'
})
export class UserAttachmentsPipe implements PipeTransform {
  transform(arr: ChatAttachment[], id: number): any {
    if ((arr || []).length === 0) {
      return [];
    }
    return arr.filter(attachment => attachment.userId === id);
  }
}
