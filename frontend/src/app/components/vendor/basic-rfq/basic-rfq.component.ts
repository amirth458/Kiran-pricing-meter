import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-rfq',
  templateUrl: './basic-rfq.component.html',
  styleUrls: ['./basic-rfq.component.css']
})
export class BasicRfqComponent implements OnInit {

  form: FormGroup = this.fb.group({
    rfqProfile: [null, Validators.required]
  });
  submitted = false;
  error = '';

  rfqProfileOptions = [];

  activePage = 'selectFiles'; // selectFiles, uploadingFiles, parts,

  partList = [];
  activePartIndex = 0;

  @ViewChild('file') file: ElementRef;
  selectedFiles = [];

  constructor(public fb: FormBuilder) { }

  ngOnInit() {
  }

  get f() { return this.form.controls; }


  toggleTab(index: number) {
    this.activePartIndex = index;
  }

  changeScreen(screenName: string) {
    this.activePage = screenName;
  }

  onOpenFile() {
    this.file.nativeElement.click();
  }

  onFileChange(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      for (const file of files) {
        if (!this.selectedFiles.includes(file)) {
          this.selectedFiles.push(file);
        }
      }
      console.log(this.selectedFiles);
      this.changeScreen('uploadingFiles');
      // this.upload(file);
    }
  }

  onFileDrag(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  removeFile(index) {
    this.selectedFiles.splice(index, 1);
  }

  submitUploadedFiles() {
    this.partList = [...this.selectedFiles.map(file => file.name.substr(0, 5))];
    this.changeScreen('parts');
  }

  save() {
    this.submitted = true;
    console.log(this.form);
  }
}
