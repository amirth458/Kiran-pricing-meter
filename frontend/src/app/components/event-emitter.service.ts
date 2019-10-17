import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
    providedIn: 'root'
})
export class EventEmitterService {

    processScreenEvent = new EventEmitter();
    subsVar: Subscription;

    constructor() { }

    onProcessScreen() {
        this.processScreenEvent.emit();
    }
}
