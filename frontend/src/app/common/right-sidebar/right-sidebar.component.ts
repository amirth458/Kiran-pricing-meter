import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { Store } from '@ngrx/store';
import { UserService } from '../../service/user.service';
import { AppFields, switchMap } from '../../store';
import { Router } from '@angular/router';
import { Customer } from '../../model/customer.model';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Vendor } from '../../model/vendor.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from '../message-modal/message-modal.component';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RightSidebarComponent implements OnInit, OnDestroy {
  @Input() sideBarOpened: string;
  @Input() selectedCustomer: Customer;
  @Input() selectedVendor: Vendor;
  @Input() showSearch: boolean;

  @Output() public sidebarClosed: EventEmitter<boolean> = new EventEmitter();

  closeOnClickOutside = true;
  isCustomer = true;
  searchLoading = false;
  searchInput = new Subject<string>();

  customers: Observable<any[]>;
  vendors: Observable<Vendor[]>;

  userInfo = {
    firstName: '',
    img: 'assets/image/avatar3.png'
  };
  sub: Subscription;
  userObserver: Observable<any>;

  constructor(
    public authService: AuthService,
    public store: Store<any>,
    public router: Router,
    public userService: UserService,
    public user: UserService,
    public cdr: ChangeDetectorRef,
    public modalService: NgbModal
  ) {
    this.userObserver = this.store.select(AppFields.App, AppFields.UserInfo);
  }

  ngOnInit() {
    this.sub = this.userObserver.subscribe(res => {
      this.userInfo = {
        ...this.userInfo,
        ...res
      };
    });
    this.loadCustomers();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  private loadCustomers() {
    this.customers = concat(
      of([]), // default items
      !this.searchInput
        ? []
        : this.searchInput.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => (this.searchLoading = true)),
            switchMap(async term => {
              if (term && term.length > 2) {
                const body = {
                  q: '',
                  filterColumnsRequests: [
                    { id: 10, displayName: 'Customer Name', selectedOperator: 'contains', searchedValue: term }
                  ]
                };
                const res = await this.userService
                  .getAllCustomers(0, 10, body)
                  .pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => (this.searchLoading = false))
                  )
                  .toPromise();
                if (res && res.content) {
                  res.content = res.content.map(cus => {
                    cus.fullName = cus.customerName + ' (' + cus.userEmail + ')';
                    return cus;
                  });
                  return res.content;
                }
              }
              this.searchLoading = false;
              return [];
            })
          )
    );
  }

  private loadVendors() {
    this.vendors = concat(
      of([]), // default items
      !this.searchInput
        ? []
        : this.searchInput.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => (this.searchLoading = true)),
            switchMap(async term => {
              if (term && term.length > 2) {
                const body = {
                  q: '',
                  filterColumnsRequests: [
                    { id: 2, displayName: 'Vendor Name', selectedOperator: 'contains', searchedValue: term }
                  ]
                };
                const res = await this.userService
                  .getAllUsers(0, 10, body)
                  .pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => (this.searchLoading = false))
                  )
                  .toPromise();
                if (res && res.content) {
                  res.content = res.content.map(vendor => {
                    vendor.fullName = vendor.name + ' (' + vendor.email + ')';
                    return vendor;
                  });
                  return res.content;
                }
              }
              this.searchLoading = false;
              return [];
            })
          )
    );
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onClosed() {
    this.selectedVendor = null;
    this.selectedCustomer = null;
    this.sidebarClosed.emit();
  }

  onCustomerSelect() {
    this.selectedVendor = null;
    this.loadCustomers();
  }

  onVendorSelect() {
    this.selectedCustomer = null;
    this.loadVendors();
  }

  openNote() {}

  openEmail() {}

  openChat() {}

  openScheduleMeet() {}

  openNextMeet() {}

  openMessageModal(typeEmail: boolean) {
    const selectedUserId =
      this.isCustomer && this.selectedCustomer ? this.selectedCustomer.userId : this.selectedVendor.user.id;
    if (selectedUserId) {
      this.closeOnClickOutside = false;
      const modalRef = this.modalService.open(MessageModalComponent, {
        centered: false,
        windowClass: 'message-modal-position'
      });
      modalRef.componentInstance.modalInput = { userId: selectedUserId, isMessageEmail: typeEmail };
      modalRef.result.then(
        (res: any) => {},
        reason => {
          this.closeOnClickOutside = true;
          this.cdr.detectChanges();
        }
      );
    }
  }
}
