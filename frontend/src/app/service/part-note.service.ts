import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Participant, PartNote, PartNoteView } from '../model/part.note.model';

@Injectable({
  providedIn: 'root'
})
export class PartNoteService {
  constructor(public http: HttpClient) {}

  getAllPartNotes(partId: number): Observable<PartNoteView> {
    return this.http.get<PartNoteView>(`${environment.apiBaseUrl}/admin/part-notes/${partId}`).pipe(
      map(v => {
        const u = v.users.reduce((u: any, value: Participant) => {
          u[value.id] = value;
          return u;
        }, {});
        v.messages.map(message => {
          message.user = u[message.userId];
        });
        return v;
      })
    );
  }

  addPartNote(note: PartNote): Observable<PartNote> {
    return this.http.post<PartNote>(`${environment.apiBaseUrl}/admin/part-notes`, note);
  }

  markPartNoteAsRead(partNoteId: number): Observable<PartNote> {
    return this.http.patch<PartNote>(`${environment.apiBaseUrl}/admin/part-notes/${partNoteId}/mark-read`, null);
  }

  deletePartNote(partNoteId: number): Observable<PartNote> {
    return this.http.patch<PartNote>(`${environment.apiBaseUrl}/admin/part-notes/${partNoteId}/delete`, null);
  }
}
