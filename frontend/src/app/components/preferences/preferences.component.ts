import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { VendorService } from 'src/app/service/vendor.service';
import { VendorMetaDataTypes } from 'src/app/mockData/vendor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PreferenceService } from 'src/app/service/preference.service';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, AfterViewChecked {
  form: FormGroup = this.fb.group({
    id: [null],
    coreCompetence: [''],
    adjacentGrowth: [''],
    rfqExclusionCondition: [''],
    clientExclusionCondition: [''],
    vendorId: [null]
  });

  coreCompetencies = [];
  adjacentGrowth = [];
  rfqExclusionCondition = [];
  clientExclusionCondition = [];

  isPreferenceAvailable = false;

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
          id: null,
          vendorId: this.userService.getUserInfo().id,
          coreCompetence: {},
          adjacentGrowth: {},
          rfqExclusionCondition: '',
          clientExclusionCondition: '',
        };
        this.initForm(userInfo);
      });
    try {
      this.coreCompetencies = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Competence).toPromise();
      this.adjacentGrowth = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.AdjacentGrowth).toPromise();
      this.spineer.hide();
    } catch (e) {
      this.spineer.hide();
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  initForm(initValue) {
    this.form.setValue({
      id: initValue.id,
      coreCompetence: initValue.coreCompetence.id,
      adjacentGrowth: initValue.adjacentGrowth.id,
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
    let preferences = {
      ...this.form.value,
      adjacentGrowth: {},
      coreCompetence: {},
    };

    if (this.form.value.adjacentGrowth != '') {
      preferences = {
        ...preferences,
        adjacentGrowth: {
          id: this.form.value.adjacentGrowth
        }
      };
    }

    if (this.form.value.coreCompetence != '') {
      preferences = {
        ...preferences,
        coreCompetence: {
          id: this.form.value.coreCompetence
        }
      };
    }
    if (this.isPreferenceAvailable) {

      this.preferenceService.updatePreference(preferences.id, preferences)
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
