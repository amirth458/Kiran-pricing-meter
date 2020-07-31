import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { Store } from '@ngrx/store';
import { UserService } from '../../service/user.service';
import { AppFields, switchMap } from '../../store';
import { Router } from '@angular/router';
import { Customer } from '../../model/customer.model';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Vendor } from '../../model/vendor.model';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent implements OnInit {
  @Input('sideBarOpened') sideBarOpened: string;

  @Output() public sidebarClosed: EventEmitter<boolean> = new EventEmitter();

  isCustomer = true;
  searchLoading = false;
  searchInput = new Subject<string>();

  customers: Observable<Customer[]>;
  vendors: Observable<Vendor[]>;
  selectedCustomer: Customer;
  selectedVendor: Vendor;

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
    public user: UserService
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

  trackByFn(item) {
    return item.customerId;
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
                return res.content;
              }
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
            return res.content;
          }
          return [];
        })
        )
    );
  }

  onSearchClose() {
    this.searchInput = null;
    // this.loadPeople();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onClosed() {
    this.sidebarClosed.emit();
  }

  onCustomerSelect() {
    this.selectedVendor = null;
    this.loadVendors();
  }

  onVendorSelect() {
    this.selectedCustomer = null;
    this.loadVendors();
  }
}
