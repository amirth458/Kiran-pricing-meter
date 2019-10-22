import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';

import {ICellEditorAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-multi-select-cell-editor',
  styleUrls: ['./multi-select-cell-editor.component.css'],
  templateUrl: './multi-select-cell-editor.component.html',
})
export class MultiSelectCellEditorComponent implements ICellEditorAngularComp, AfterViewInit  {

  private params: any;

    @ViewChild('container', {read: ViewContainerRef}) public container;
    public happy = false;

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        window.setTimeout(() => {
            // this.container.element.nativeElement.focus();
        });
    }

    agInit(params: any): void {
        this.params = params;
        this.setHappy(params.value === 'Happy');
    }

    getValue(): any {
        return this.happy ? 'Happy' : 'Sad';
    }

    isPopup(): boolean {
        return true;
    }

    setHappy(happy: boolean): void {
        this.happy = happy;
    }

    toggleMood(): void {
        this.setHappy(!this.happy);
    }

    onClick(happy: boolean) {
        this.setHappy(happy);
        this.params.api.stopEditing();
    }
}
