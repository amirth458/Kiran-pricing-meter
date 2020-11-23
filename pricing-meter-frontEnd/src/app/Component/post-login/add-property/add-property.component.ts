import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../../Shared/AppBaseComponent";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent extends AppComponentBase implements OnInit {
  public propertyForm: FormGroup;
  constructor(private inject: Injector, private formBuilder: FormBuilder,) {
    super(inject);
  }

  ngOnInit(): void {
    this.initForm()
  }

  onSubmit(): void{
    this.router.navigate(['pricing-meter/add-property/review']);
  }

  navigateTo(): void {
  }

  initForm(): void{
    this.propertyForm = this.formBuilder.group({
      ownerName: ['', []],
      email: ['', []],
      address: ['', []],
      zipcode: ['', []],
    });
  }


}
