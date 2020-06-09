import {
  Component,
  OnInit,
  ContentChild,
  ViewChild,
  ElementRef,
  TemplateRef,
  Input,
  EventEmitter,
  Output
} from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { combineLatest, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';
import { ProposalService } from 'src/app/service/proposal.service';

@Component({
  selector: 'app-proposal-attachment',
  templateUrl: './proposal-attachment.component.html',
  styleUrls: ['./proposal-attachment.component.css']
})
export class ProposalAttachmentComponent implements OnInit {
  @ContentChild('content') content: ElementRef;
  @ViewChild('attachmentTemplate') attachmentTemplate: TemplateRef<any>;

  @Input() partId;
  @Input() proposalPartId;
  @Input() type;
  @Input() savedFiles = [];

  // Functionality and UI Control
  @Input() customerView = true;
  @Input() vendorView = false;
  @Input() canUpload = false;
  @Input() smallView = false;

  @Output() changeFiles = new EventEmitter<any>();
  @Output() deleteFiles = new EventEmitter<any>();

  files: any[] = [];
  // users: Array<UserSummary>;
  // attachments: Array<ChatAttachment>;
  modalOpened: boolean;

  uploadedAttachments = [
    {
      type: 'You',
      files: []
    },
    {
      type: 'Customer',
      files: []
    }
  ];
  needUpload = false;

  public config: PerfectScrollbarConfigInterface = {};

  constructor(
    public proposalService: ProposalService,
    public userService: UserService,
    public projectService: ProjectService,
    public modalService: NgbModal,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.customerView && this.partId) {
      const ob =
        this.type === 'attachment'
          ? this.projectService.getAllReferenceMediaFiles(this.partId)
          : this.proposalService.getCustomerGovernanceMedia(this.partId);

      ob.subscribe(
        (e: any) => {
          this.uploadedAttachments[1].files = e;
        },
        e => {}
      );
    }

    if (this.vendorView) {
      if ((this.savedFiles || []).length) {
        this.uploadedAttachments[0].files = this.savedFiles;
      } else if (this.proposalPartId) {
        const ob =
          this.type === 'attachment'
            ? this.projectService.getAllProposalReferenceMediaFiles(this.partId, this.proposalPartId)
            : this.proposalService.getProjectGovernanceDediaForPartProposal(this.partId, this.proposalPartId);
        ob.subscribe(
          (e: any) => {
            this.uploadedAttachments[0].files = e;
          },
          e => {}
        );
      }
    }
  }

  get customerAttachments() {
    return this.uploadedAttachments[1].files;
  }

  viewFiles(size: any = 'lg') {
    const options: any = {
      size,
      centered: true,
      windowClass: 'attachment-modal',
      scrollable: true
    };
    this.modalService.open(this.attachmentTemplate, options).result.then(
      result => {},
      reason => {
        this.modalOpened = false;
      }
    );
    this.modalOpened = true;
  }

  fileDropped($event) {
    this.prepareFilesList($event);
  }

  fileChangeHandler($event) {
    this.prepareFilesList($event.target.files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
    if (this.files.length != 0) {
      this.needUpload = true;
    }
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.files.push(item);
    }
    this.needUpload = true;
  }

  formatBytes(bytes, decimals: number = 0) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  upload() {}

  delete($event, file) {
    $event.preventDefault();
    $event.stopPropagation();
    // this.toastr.warning("This feature is under development");
    this.uploadedAttachments[0].files = this.uploadedAttachments[0].files.filter(_ => _.id !== file.id);
    this.deleteFiles.emit(file);
  }

  get fileNames() {
    const str = this.uploadedAttachments[0].files.map(file => file.name).join(', ') || '';
    return str || 'Upload Files';
  }
}
