import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-multi-select-cell-editor',
    styleUrls: ['./multi-select-cell-editor.component.css'],
    templateUrl: './multi-select-cell-editor.component.html',
})
export class MultiSelectCellEditorComponent implements ICellEditorAngularComp, AfterViewInit {

    private params: any;
    @ViewChild('modal') modal;
    selectedValues = [];
    options = [];
    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        window.setTimeout(() => {
            // this.container.element.nativeElement.focus();
            this.modal.nativeElement.click();
            $('.modal-backdrop').removeClass('show');
            $('.modal-backdrop').css('left', '0');
            $('.modal-backdrop').css('top', '0');
            $('.modal-backdrop').css('width', '1');
            $('.modal-backdrop').css('height', '1');
        });
    }

    agInit(params: any): void {
        this.params = params;
        console.log(this.params, 'editor');
        this.options = params.data.valueOptions;
        this.selectedValues = [];
        if (params.data.value > 0) {
            this.selectedValues = [params.data.value];
        }
    }

    getValue(): any {
        return this.selectedValues;
    }

    isPopup(): boolean {
        return true;
    }

    onClick(happy: boolean) {
        console.log("click");
        // this.params.api.stopEditing();
    }

    onSave() {
        this.params.api.stopEditing();
        this.params.colDef.cellRendererParams.change(this.params, this.selectedValues);
    }
}
