import { Component, OnInit, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, AfterViewChecked {
  form = {
    core_competencies: '',
    adjacent_growth: '',
    RFQ_to_exclude: '',
    companies_to_exclude: ''
  };
  coreCompetencies = [];
  adjacentGrowth = [];
  RFQToExclude = [];

  constructor() { }

  ngOnInit() {
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
