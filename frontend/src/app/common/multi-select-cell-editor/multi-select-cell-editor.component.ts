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
            // TODO: Change the following to ES6
            // $('.modal-backdrop').removeClass('show');
            // $('.modal-backdrop').css('left', '0');
            // $('.modal-backdrop').css('top', '0');
            // $('.modal-backdrop').css('width', '1');
            // $('.modal-backdrop').css('height', '1');
        });
    }

    agInit(params: any): void {
        this.params = params;
        this.options = params.data.valueOptions;
        this.selectedValues = [];
        if (Array.isArray(params.data.value)) {
            this.selectedValues = [...params.data.value];
        } else if (params.data.value > 0) {
            this.selectedValues = [params.data.value];
        }

        if (this.selectedValues.length > 0 && this.selectedValues.includes('all-line-items')) {
            this.selectedValues = ['all-line-items'];
        }

        const filteredSelectedValue = [];
        this.selectedValues.map(value => {
            if (this.options.filter(option => option.id == value).length > 0) {
                filteredSelectedValue.push(value);
            }
        });
        this.selectedValues = [...filteredSelectedValue];
    }

    getValue(): any {
        return this.selectedValues;
    }

    onValueChange() {
        if (this.selectedValues.length > 0 && this.selectedValues[this.selectedValues.length - 1] === 'all-line-items') {
            this.selectedValues = ['all-line-items'];
        }

        if (this.selectedValues.length > 0 &&
            this.selectedValues.includes('all-line-items') &&
            this.selectedValues[this.selectedValues.length - 1] !== 'all-line-items') {
            this.selectedValues = this.selectedValues.filter(value => value !== 'all-line-items');
        }

    }

    isPopup(): boolean {
        return true;
    }

    onClick(happy: boolean) {
        // this.params.api.stopEditing();
    }

    onSave() {
        this.modal.nativeElement.click();
        this.params.api.stopEditing();
        this.params.colDef.cellRendererParams.change(this.params, this.selectedValues);
    }
}
