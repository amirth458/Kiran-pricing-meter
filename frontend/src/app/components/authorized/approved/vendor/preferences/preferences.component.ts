import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { VendorService } from 'src/app/service/vendor.service';
import { VendorMetaDataTypes } from 'src/app/mockData/vendor';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PreferenceService } from 'src/app/service/preference.service';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { VendorMetaData } from 'src/app/model/vendor.model';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
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

  tooltipCoreCompetencies = 'Highlight industries you currently support.';
  tooltipAdjacentGrowth = 'Highlight industries you seek to support.';
  tooltipRFQ = 'RFQ to exclude.';
  tooltipClientToExclude = 'Specify any industries you do not wish to support.';
  saveSuccessfully = false;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private preferenceService: PreferenceService,
    private userService: UserService,
    private spineer: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.spineer.show();
    this.preferenceService.getPreferenceByVendorId(this.userService.getVendorInfo().id).subscribe(
      (res) => {
        this.isPreferenceAvailable = true;
        this.initForm(res);
      },
      (err) => {
        this.isPreferenceAvailable = false;
        const userInfo = {
          vendorId: this.userService.getVendorInfo().id,
          vendorCoreCompetence: [],
          vendorAdjacentGrowths: [],
          rfqExclusionCondition: '',
          clientExclusionCondition: '',
        };
        this.initForm(userInfo);
      });
    try {
      const coreCompetencies = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Competence).toPromise();
      const adjacentGrowths = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.AdjacentGrowth).toPromise();

      this.coreCompetencies = coreCompetencies.map((x) => {
        const name = this.htmlDecode(x.name).replace(/&/g, ' and ');
        return { id: x.id, name };
      });
      this.adjacentGrowths = adjacentGrowths.map((x) => {
        const name = this.htmlDecode(x.name).replace(/&/g, ' and ');
        return { id: x.id, name };
      });

      this.spineer.hide();
    } catch (e) {
      this.spineer.hide();
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  initForm(initValue) {
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

  save(event) {
    this.spineer.show();
    const preferences = {
      ...this.form.value,
      vendorAdjacentGrowths: this.adjacentGrowths.filter((item) => this.selectedAdjacentGrowth.includes(item.id)),
      vendorCoreCompetencies: this.coreCompetencies.filter((item) => this.selectedCoreCompetence.includes(item.id)),
    };
    if (this.isPreferenceAvailable) {
      this.preferenceService.updatePreference(preferences)
        .subscribe(
          res => {
            this.toastr.success('Preferences updated Successfully');
            this.spineer.hide();
          },
          error => {
            this.toastr.error('We are sorry, Preferences saving failed. Please try again later.');
            this.spineer.hide();
          });
    } else {
      this.preferenceService.createPreference(preferences)
        .subscribe(
          res => {
            this.isPreferenceAvailable = true;
            this.initForm(res);
            this.toastr.success('Preferences created Successfully');
            this.spineer.hide();
          },
          err => {
            this.toastr.error('We are sorry, Preferences saving failed. Please try again later.');
            this.spineer.hide();
          });
    }
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }
}
