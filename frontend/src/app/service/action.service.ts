import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  saveProfileSetting: Subject<any> = new Subject();
  constructor() { }

  triggerSaveProfileSetting() {
    console.log('trigger');
    this.saveProfileSetting.next();
  }
  saveProfileSettingAction() {
    return this.saveProfileSetting.asObservable();
  }
}
