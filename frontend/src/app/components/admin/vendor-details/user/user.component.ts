import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-vendor-details-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class AdminVendorDetailsUserComponent
  implements OnInit, AfterViewChecked {
  @ViewChild('declineCommentsModal') declineCommentsModal;
  form: FormGroup = this.fb.group({
    email: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    phone: [null, Validators.required]
  });
  status = 0;
  vendorId = 0;
  declineComments = '';
  primaryContactName = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    try {
      const userId = this.router.url.split('/')[3];
      const res = await this.userService.getUserDetails(userId).toPromise();
      const user = {
        email: res.email,
        firstName: res.firstName,
        lastName: res.lastName,
        phone: res.phoneNo
      };
      this.initUser(user);
      if (res.vendor) {
        this.vendorId = res.vendor.id;
        this.primaryContactName =
          res.vendor.primaryContactFirstName +
          ' ' +
          res.vendor.primaryContactLastName;
        if (res.vendor.approved) {
          this.status = 1; // approved
        } else {
          if (res.vendor.approvedAt !== null) {
            this.status = 2; // declined
          } else {
            this.status = 3; // non-approved
          }
        }
      } else {
        this.status = 0; // can't approve, decline
      }
    } catch (e) {
      console.log(e);
    }
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
  }

  initUser(user): void {
    this.form.setValue({
      ...user
    });
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return this.form.value[field] === '' || this.form.value[field] === null;
    } else if (fieldType === 2) {
      return Number(this.form.value[field]) === 0;
    }
  }

  samePassword() {
    if (
      this.form.value.passwordConfirm !== '' &&
      this.form.value.passwordConfirm !== null
    ) {
      if (this.form.value.password !== this.form.value.passwordConfirm) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async approveUser() {
    this.spinner.show();
    try {
      await this.userService.approveUser(this.vendorId).toPromise();
      this.router.navigateByUrl('/user-manage/approve');
    } catch (e) {
      this.toastr.error(
        'We are sorry, Vendor is not approved. Please try again later.'
      );
    } finally {
      this.spinner.hide();
    }
  }

  onDeclineUser() {
    this.modalService.open(this.declineCommentsModal, {
      windowClass: 'decline-comments-modal',
      centered: true,
      size: 'lg'
    });
  }

  closeDeclineModal() {
    this.modalService.dismissAll();
  }

  async declineUser() {
    if (this.declineComments === '') {
      return;
    }
    this.closeDeclineModal();
    this.spinner.show();
    try {
      await this.userService
        .declineUser(this.vendorId, this.declineComments)
        .toPromise();
      this.router.navigateByUrl('/user-manage/approve');
    } catch (e) {
      this.toastr.error(
        'We are sorry, Vendor is not declined. Please try again later.'
      );
    } finally {
      this.spinner.hide();
    }
  }
}
