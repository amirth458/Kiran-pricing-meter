import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { VendorService } from 'src/app/service/vendor.service';
import { VendorMetaDataTypes } from 'src/app/mockData/vendor';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PreferenceService } from 'src/app/service/preference.service';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { VendorMetaData } from 'src/app/model/vendor.model';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, AfterViewChecked {
  coreCompetencies: VendorMetaData[] = [];
  adjacentGrowths: VendorMetaData[] = [];

  selectedCoreCompetence = [];
  selectedAdjacentGrowth = [];
  isPreferenceAvailable = false;

  form: FormGroup = this.fb.group({
    coreCompetence: [],
    adjacentGrowth: [],
    rfqExclusionCondition: [''],
    clientExclusionCondition: [''],
    vendorId: [null]
  });

  constructor(
    public fb: FormBuilder,
    public vendorService: VendorService,
    public preferenceService: PreferenceService,
    public userService: UserService,
    public spineer: NgxSpinnerService
  ) { }

  async ngOnInit() {
    this.spineer.show();
    this.preferenceService.getPreferenceByVendorId(this.userService.getUserInfo().id).subscribe(
      (res) => {
        this.isPreferenceAvailable = true;
        this.initForm(res);
      },
      (err) => {
        this.isPreferenceAvailable = false;
        const userInfo = {
          vendorId: this.userService.getUserInfo().id,
          vendorCoreCompetence: [],
          vendorAdjacentGrowths: [],
          rfqExclusionCondition: '',
          clientExclusionCondition: '',
        };
        this.initForm(userInfo);
      });
    try {
      this.coreCompetencies = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Competence).toPromise();
      this.adjacentGrowths = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.AdjacentGrowth).toPromise();
      this.spineer.hide();
    } catch (e) {
      this.spineer.hide();
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  initForm(initValue) {
    console.log(initValue);
    this.selectedCoreCompetence = initValue.vendorCoreCompetencies.map(x => x.id) || [];
    this.selectedAdjacentGrowth = initValue.vendorAdjacentGrowths.map(x => x.id) || [];
    this.form.setValue({
      coreCompetence: [],
      adjacentGrowth: [],
      rfqExclusionCondition: initValue.rfqExclusionCondition,
      clientExclusionCondition: initValue.clientExclusionCondition,
      vendorId: initValue.vendorId
    });
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

  save() {
    this.spineer.show();
    const preferences = {
      ...this.form.value,
      vendorAdjacentGrowths: this.adjacentGrowths.filter((item) => this.selectedAdjacentGrowth.includes(item.id)),
      vendorCoreCompetencies: this.coreCompetencies.filter((item) => this.selectedCoreCompetence.includes(item.id)),
    };
    console.log(preferences);
    if (this.isPreferenceAvailable) {

      this.preferenceService.updatePreference(preferences)
        .subscribe(
          res => {
            this.spineer.hide();
          },
          error => {
            this.spineer.hide();
          });
    } else {
      this.preferenceService.createPreference(preferences)
        .subscribe(
          res => {
            this.isPreferenceAvailable = true;
            this.initForm(res);
            this.spineer.hide();
          },
          err => {
            this.spineer.hide();
          });
    }
  }
}
