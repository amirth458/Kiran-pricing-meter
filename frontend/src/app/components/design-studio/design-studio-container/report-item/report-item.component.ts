import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/service/report.service';

@Component({
  selector: 'app-report-item',
  templateUrl: './report-item.component.html',
  styleUrls: ['./report-item.component.css']
})
export class ReportItemComponent implements OnInit {
  reportId = null;
  parts = [];
  constructor(public router: ActivatedRoute, public reportService: ReportService) {
    this.reportId = this.router.snapshot.params.id;
  }

  ngOnInit() {
    this.reportService.getPartList(this.reportId).subscribe(r => {
      this.parts = r;
    });
  }
}
