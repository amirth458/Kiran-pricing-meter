import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  saveProfileSetting: Subject<any> = new Subject();
  saveFullfillmentSetting: Subject<any> = new Subject();
  constructor() { }

  triggerSaveProfileSetting() {
    this.saveProfileSetting.next();
  }
  triggerSaveFullfillmentSetting() {
    this.saveFullfillmentSetting.next();
  }
  saveProfileSettingAction() {
    return this.saveProfileSetting.asObservable();
  }
  saveFullfillmentSettingAction() {
    return this.saveFullfillmentSetting.asObservable();
  }
}
