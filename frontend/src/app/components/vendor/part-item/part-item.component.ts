import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-part-item',
  templateUrl: './part-item.component.html',
  styleUrls: ['./part-item.component.css']
})
export class PartItemComponent implements OnInit {

  activeTab = 'normal'; // tolerances

  form: FormGroup = this.fb.group({
    partProfile: [null, Validators.required],
    quantity: [null, Validators.required],
    material: [null, Validators.required],
    process: [null, Validators.required],
    surfaceRoughness: [null, Validators.required],
    criticalTolerance1: ['', Validators.required],
    criticalTolerance2: ['', Validators.required],
    criticalTolerance3: ['', Validators.required],
    targetDeliveryDate: [null, Validators.required],
    postProcessActions: [null, Validators.required],
    boundingOk: [null, Validators.required]

  });
  submitted = false;
  error = '';

  deliveryDates = [{
    quantity: '',
    date: {
      day: '',
      month: '',
      year: ''
    }
  },
  {
    quantity: '',
    date: {}
  }];

  partProfileOptions = [];
  materialOptions = [];
  processOptions = [
    { name: '3D Printing', id: 1 },
    { name: 'Casting', id: 2 },
    { name: 'Molding', id: 3 },
    { name: 'Machining', id: 4 }
  ];
  boundingOkOptions = [];
  postProcessActionOptions = [
    { name: 'Electropolishing', id: 1, checked: false },
    { name: 'Grinding', id: 2, checked: false },
    { name: 'Polishing', id: 3, checked: false },
    { name: 'Standard Grind', id: 4, checked: false },
    { name: 'Blasting', id: 5, checked: false },
    { name: 'Machining (Milling)', id: 5, checked: false }
  ];


  processOptionsFiltered = [];


  constructor(public fb: FormBuilder, public modalService: NgbModal) { }

  ngOnInit() {
  }

  get f() { return this.form.controls; }

  get selectedDeliveryItemCount() {
    let sum = 0;
    this.deliveryDates.map(shipment => {
      if (shipment.date.month && shipment.quantity) {
        sum += Number(shipment.quantity);
      }
    });
    return sum;
  }

  get quantity() {
    return this.form.value.quantity || 0;
  }

  toggleTab(tabName: string) {
    this.activeTab = tabName;
  }

  onRemoveFile() {
    console.log('Remove file');
  }

  open(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }

  onPartToolSearch(event) {
    const input = event.target.value;
    if (input.length !== 0) {
      this.processOptionsFiltered = this.processOptions.filter(option =>
        option.name.toLowerCase().startsWith(input ? input.toLowerCase() : ''));
    } else {
      this.processOptionsFiltered = [];
    }
  }

  selectProcess(id: number) {
    this.form.controls.process.setValue(id);
  }

  togglePostProcessCheck(index) {
    this.postProcessActionOptions[index].checked = !this.postProcessActionOptions[index].checked;
    this.form.controls.postProcessActions.setValue(this.postProcessActionOptions.filter(item => item.checked).map(item => item.id));
  }
}

