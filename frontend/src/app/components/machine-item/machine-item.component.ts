import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Machine } from 'src/app/model/machine.model';

import * as machines from '../../../assets/static/machines';
import { Router } from '@angular/router';

@Component({
  selector: 'app-machine-item',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.css']
})
export class MachineItemComponent implements OnInit, AfterViewChecked {

  facilities = [];
  equipments = [];
  form: Machine = {
    id: '',
    venderInfoId: '',
    machineName: '',
    serialNumber: '',
    equipment: '',
    material: [],
    facilityId: '',
    createdBy: '',
    createdDate: '',
    updatedDate: '',
  };
  machineId = null;
  machines = machines;
  constructor(public route: Router) { }

  ngOnInit() {
    if (this.route.url.includes('edit')) {
      this.machineId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      const machine = this.machines.filter(x => x.id == this.machineId);
      if (machine.length > 0) {
        this.form = { ...this.form, ...machine[0] };
      }
      // Make API request
    }
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, (form) => {
      form.addEventListener('submit', (event) => {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          this.save();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }
  save() {
    console.log(this.form);
  }
}
