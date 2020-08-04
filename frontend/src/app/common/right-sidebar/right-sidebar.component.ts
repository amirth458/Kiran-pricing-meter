import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  Input,
  OnInit,
  Output,
  ViewEncapsulation, ViewChild, ElementRef
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
import { Chat, ChatParticipantEnum, ChatTypeEnum } from '../../model/chat.model';
import { GlobalChatComponent } from '../../components/chat/global-chat/global-chat.component';
import { Conference, ConferenceRequest } from '../../model/conference.model';
import { Util } from '../../util/Util';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ZoomService } from '../../service/zoom.service';

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
  @ViewChild('dateTimeSelectorSideBar') 'dateTimeSelector': ElementRef;

  closeOnClickOutside = true;
  isCustomer = true;
  searchLoading = false;
  searchInput = new Subject<string>();

  customers: Observable<any[]>;
  vendors: Observable<Vendor[]>;

  userInfo = {
    firstName: '',
    img: 'assets/image/user-profile-icon.png',
    lastName: '',
    email: ''
  };
  sub: Subscription;
  userObserver: Observable<any>;

  chatTypeEnum = ChatTypeEnum;
  chat: Chat;
  chatParticipantEnum = ChatParticipantEnum;

  startTime;
  conference: Conference = new Conference();

  constructor(
    public authService: AuthService,
    public store: Store<any>,
    public router: Router,
    public userService: UserService,
    public user: UserService,
    public cdr: ChangeDetectorRef,
    public spinner: NgxSpinnerService,
    public toaster: ToastrService,
    public zoomService: ZoomService,
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
    this.getGlobalConference();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  // TODO refactor
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
    this.sidebarClosed.emit();
  }

  onCustomerSelect() {
    this.selectedVendor = null;
    this.conference = new Conference();
    this.loadCustomers();
  }

  onVendorSelect() {
    this.selectedCustomer = null;
    this.conference = new Conference();
    this.loadVendors();
  }

  onTypeAheadClose() {
    this.closeOnClickOutside = true
    this.getGlobalConference();
  }

  openNote() {
    const selectedUserId =
      this.isCustomer && this.selectedCustomer ? this.selectedCustomer.userId : this.selectedVendor.user.id;
    const selectedUserName = (this.isCustomer && this.selectedCustomer)
      ? this.selectedCustomer.customerName : this.selectedVendor.name;
    if (selectedUserId) {
      this.onClosed();
      const modalRef = this.modalService.open(GlobalChatComponent, {
        centered: false,
        windowClass: 'global-chat-position'
      });
      modalRef.componentInstance.modalInput = {
        userId: selectedUserId,
        userName: selectedUserName,
        isCustomer: this.isCustomer,
      };
      modalRef.result.then(
        (res: any) => {},
        reason => {
          this.cdr.detectChanges();
        }
      );
    }
  }

  openMessageModal(typeEmail: boolean) {
    const selectedUserId =
      this.isCustomer && this.selectedCustomer ? this.selectedCustomer.userId : this.selectedVendor.user.id;
    if (selectedUserId) {
      this.onClosed();
      const modalRef = this.modalService.open(MessageModalComponent, {
        centered: false,
        windowClass: 'message-modal-position'
      });
      modalRef.componentInstance.modalInput = { userId: selectedUserId, isMessageEmail: typeEmail };
      modalRef.result.then(
        (res: any) => {},
        reason => {
          this.cdr.detectChanges();
        }
      );
    }
  }

  getGlobalConference() {
    this.conference = new Conference();
    const selectedUserId =
      this.isCustomer && this.selectedCustomer ? this.selectedCustomer.userId : this.selectedVendor.user.id;
    if (selectedUserId) {
      this.zoomService
        .getGlobalConference(selectedUserId, this.userService.getUserInfo().id)
        .subscribe(
          res => {
            this.conference = res;
            if (res) {
              this.conference.isExpired =
                this.conference.isExpired || Util.compareDate(new Date(), new Date(this.conference.startTime)) === 1;
            }
          },
          err => {
            console.log({ err });
            this.toaster.error('Unable to fetch meeting info');
          }
        );
    }
  }

  openScheduleMeet() {
    this.closeOnClickOutside = false;
    if (this.dateTimeSelector) {
      this.dateTimeSelector.nativeElement.click();
    }
  }

  onTimeChanged(event) {
    this.spinner.show();
    this.closeOnClickOutside = true;
    const selectedUserId =
      this.isCustomer && this.selectedCustomer ? this.selectedCustomer.userId : this.selectedVendor.user.id;
    const meetingTime = new Date(event).toISOString();
    const conference: ConferenceRequest = {
      hostUserId: this.userService.getUserInfo().id,
      participantUserId: selectedUserId,
      conferenceTopic: 'Meeting with 3Digilent ' + selectedUserId,
      conferencePassword: selectedUserId.toString(),
      startTimeInUTC: meetingTime.substr(0, meetingTime.length - 5) + 'Z',
      isGlobal: true,
      duration: 1
    };
    this.zoomService.createConference(conference).subscribe(
      (res: Conference) => {
        if (res) {
          this.conference = res;
          this.conference.startTime = new Date(res.startTime).toISOString();
          this.conference.isExpired =
            this.conference.isExpired || Util.compareDate(new Date(), new Date(this.conference.startTime)) === 1;
          this.startTime = new Date(res.startTime).toISOString();
        }
        this.spinner.hide();
        this.toaster.success('Meeting time set.');
      },
      err => {
        console.log({ err });
        this.spinner.hide();
        this.toaster.error('Error while scheduling meeting. Please Contact Admin.');
      }
    );
  }
}
