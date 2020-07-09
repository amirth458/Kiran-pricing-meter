import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  Renderer,
  Renderer2,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Directive({
  selector: '[appFeatureLock]'
})
export class FeatureLockDirective implements OnInit {
  customClass = 'locked';
  lockIconClass = 'add-icon';
  @Input() featureType: number[];
  @Input() noIcon = false;
  @Output() featureClick = new EventEmitter();
  @HostListener('click', ['$event'])
  onClick(e) {
    this.clickHandler(e);
  }
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private toaster: ToastrService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (!this.userHasPrivilage()) {
      this.renderer.addClass(this.el.nativeElement, this.customClass);
      this.disableElement();
      if (!this.noIcon) {
        this.renderer.addClass(this.el.nativeElement, this.lockIconClass);
      }
    }
  }

  clickHandler(e) {
    if (!this.userHasPrivilage()) {
      e.preventDefault();
      e.stopPropagation();
      this.toaster.warning('Locked Feature!');
      this.disableElement();
      return;
    } else {
      this.featureClick.next(e);
    }
  }

  disableElement() {
    if (this.el) {
      this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
    }
  }

  userHasPrivilage() {
    if (!(this.featureType || []).length) {
      return true;
    }
    const userInfo = this.userService.getUserInfo();
    const entitlements = (userInfo && userInfo.contractDetails && userInfo.contractDetails.entitlement) || [];
    if (entitlements.length) {
      const entitlementIds = entitlements.map(e => e.feature.id);
      return entitlementIds.length
        ? !this.featureType.filter(featureId => !entitlementIds.includes(featureId)).length
        : false;
    }
  }
}
