import { Pipe, PipeTransform } from '@angular/core';
import { MessageNote } from '../model/chat.model';

@Pipe({
  name: 'unReadCount'
})
export class UnReadCountPipe implements PipeTransform {
  transform(messages: Array<MessageNote>, userId: number): number {
    let unReadCount = 0;
    if ((messages || []).length === 0) {
      return unReadCount;
    }
    const filteredItems = messages.filter(note => note.senderId !== userId);
    filteredItems.map(message => {
      unReadCount += message.messageNoteHistory.filter(history => !history.isRead).length;
    });
    return unReadCount;
  }
}
