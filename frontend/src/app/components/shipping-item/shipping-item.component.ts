import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShippingService } from '../../service/shipping.service';
import { VendorService } from '../../service/vendor.service';
import { UserService } from '../../service/user.service';
import { Shipping } from '../../model/shipping.model';

import { VendorMetaDataTypes } from '../../mockData/vendor';
@Component({
  selector: 'app-shipping-item',
  templateUrl: './shipping-item.component.html',
  styleUrls: ['./shipping-item.component.css']
})
export class ShippingItemComponent implements OnInit, AfterViewChecked {

  shippingItem: FormGroup = this.fb.group({
    id: [null],
    shippingProvider: [null, Validators.required],
    accountId: [null, Validators.required],
    isActive: [null, Validators.required],
    createdBy: null,
    createdDate: null,
    updatedDate: null
  });

  carriers = null;
  shippingId = null;
  isNew = true;

  constructor(
    public fb: FormBuilder,
    private route: Router,
    private shippingService: ShippingService,
    private vendorService: VendorService,
    private spineer: NgxSpinnerService,
    private userService: UserService) { }


  async ngOnInit() {
    this.spineer.show();
    await this.getMetaData();
    if (this.route.url.includes('edit')) {
      this.shippingId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      this.isNew = false;
      this.getShipping(this.shippingId);
    } else {
      this.spineer.hide();
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
        }
        form.classList.add('was-validated');
      }, false);
    });
  }

  async getMetaData() {
    try {
      this.carriers = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.ShippingPrivider).toPromise();
    } catch (e) {
      console.log(e);
    }
  }

  async getShipping(shippingId: number) {
    try {
      const data = await this.shippingService.getShipping(this.userService.getUserInfo().id, shippingId).toPromise();
      this.initForm(data);
    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  initForm(data: any) {
    this.shippingItem.setValue({
      id: data.id,
      shippingProvider: data.shippingProvider.id,
      accountId: data.accountId,
      isActive: data.isActive ? true : false,
      createdBy: data.createdBy || '',
      createdDate: data.createdDate || '',
      updatedDate: data.updatedDate || '',
    });
  }

  save(event) {
    if (!(this.shippingItem.valid && this.shippingItem.dirty)) {
      return;
    }
    this.spineer.show();

    const vendorId = this.userService.getUserInfo().id;

    const shipping: Shipping = {
      ...this.shippingItem.value
    };
    shipping.shippingProvider = { id: Number(shipping.shippingProvider) };
    shipping.updatedDate = new Date().toString();

    if (this.isNew) {
      shipping.createdBy = String(this.userService.getUserInfo().id);
      shipping.createdDate = new Date().toString();

      this.shippingService.createShipping(vendorId, shipping).subscribe(res => {
        const gotoURL = `/profile/vendor/shipping`;
        this.route.navigateByUrl(gotoURL);
        this.spineer.hide();
      }, error => {
        console.log(error);
        this.spineer.hide();
      });
    } else {
      this.shippingService.updateShipping(vendorId, this.shippingId, shipping).subscribe(res => {
        const gotoURL = `/profile/vendor/shipping`;
        this.route.navigateByUrl(gotoURL);
        this.spineer.hide();
      }, error => {
        console.log(error);
        this.spineer.hide();
      });
    }

  }
}
