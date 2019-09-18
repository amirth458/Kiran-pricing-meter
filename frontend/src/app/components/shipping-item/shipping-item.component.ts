import { Component, OnInit, AfterViewChecked } from '@angular/core';

import * as shippings from '../../../assets/static/shipping';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipping-item',
  templateUrl: './shipping-item.component.html',
  styleUrls: ['./shipping-item.component.css']
})
export class ShippingItemComponent implements OnInit, AfterViewChecked {


  form = {
    id: '',
    carrier: '',
    accountId: '',
    status: ''
  };
  carriers = [
    {
      id: 'USPS', name: 'USPS'
    },
    {
      id: 'DHL Express', name: 'DHL Express'
    },
    {
      id: 'Fast Australia', name: 'Fast Australia'
    },
    {
      id: 'CouriersPlease', name: 'CouriersPlease'
    },
    {
      id: 'Sendle', name: 'Sendle'
    },
    {
      id: 'Deutsche Post', name: 'Deutsche Post'
    },
    { id: 'FedEx', name: 'FedEx' },
  ];
  shippingId = null;
  shippings = shippings;
  constructor(public route: Router) { }

  ngOnInit() {
    if (this.route.url.includes('edit')) {
      this.shippingId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      const shipping = this.shippings.filter(x => x.id == this.shippingId);
      if (shipping.length > 0) {
        this.form = { ...this.form, ...shipping[0] };
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
