import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../../Shared/AppBaseComponent";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent extends AppComponentBase implements OnInit {
  public propertyForm: FormGroup;
  public cities = ['Chennai', 'Bangalore'];

  control = new FormControl();
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  filteredStreets: Observable<string[]>;
  constructor(private inject: Injector, private formBuilder: FormBuilder,) {
    super(inject);
  }

  ngOnInit(): void {
    this.initForm()
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
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
      state: ['', []],
      city: ['',[]]
    });
  }

  navigateToCSV(): void {
    this.router.navigate(['pricing-meter/add-property/csv'])
  }

  homePage(): void{
    this.router.navigate(['login']);
  }


}
