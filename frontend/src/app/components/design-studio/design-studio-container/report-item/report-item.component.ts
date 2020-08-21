import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/service/report.service';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportStatus } from 'src/app/model/reports.model';
import { ZoomTypeEnum, ZoomParticipantEnum } from 'src/app/model/conference.model';
import { ChatTypeEnum, ChatParticipantEnum, Chat } from 'src/app/model/chat.model';

@Component({
  selector: 'app-report-item',
  templateUrl: './report-item.component.html',
  styleUrls: ['./report-item.component.css']
})
export class ReportItemComponent implements OnInit {
  rfqId = null;
  parts = [];
  zoomTypeEnum = ZoomTypeEnum;
  zoomParticipantEnum = ZoomParticipantEnum;
  chatParticipantEnum = ChatParticipantEnum;
  chatTypeEnum = ChatTypeEnum;
  chat: Chat;
  constructor(
    public router: ActivatedRoute,
    public reportService: ReportService,
    public toaster: ToastrService,
    public spinner: NgxSpinnerService
  ) {
    this.rfqId = this.router.snapshot.params.id;
  }

  ngOnInit() {
    this.getData();
  }
  getData() {
    this.spinner.show();
    combineLatest(
      this.reportService.getPartList(this.rfqId),
      this.reportService.getDesignReportOrderQueueReportsView(this.rfqId)
    ).subscribe(([parts, partDetails]) => {
      this.parts = parts.map(part => {
        const details = partDetails.filter(_ => _.partId == part.id);
        return { ...part, details };
      });
      this.spinner.hide();
    });
  }

  canSendToCustomer() {
    return (
      (this.parts || []).length &&
      this.parts[0].details[0].designReportsOrderQueueStatus.id === ReportStatus.ANALYSIS_COMPLETE
    );
  }

  sendToCustomer() {
    this.spinner.show();
    this.reportService.sendToCustomer(this.rfqId).subscribe(
      res => {
        this.toaster.success('Report sent to customer');
        this.getData();
      },
      err => {
        console.log(err);
        this.spinner.hide();
        this.toaster.error('Error while sending report to customer');
      }
    );
  }
}
