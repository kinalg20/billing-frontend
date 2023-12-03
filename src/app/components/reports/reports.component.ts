import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AppUtility } from 'src/app/apputitlity';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  customerDropdown: any[] = [];

  constructor(private Fb: FormBuilder, private apiService: ApiService, private loader: AppUtility , private messageService : MessageService , private utility : AppUtility) { }

  date: any;
  ngOnInit(): void {
    this.date = new Date();
    this.showCustomerDropdown();
  }

  breadcrumb = [
    {
      title: "Report Master",
      subTitle: "Dashboard"
    },
  ];


  reports = this.Fb.group({
    year: [''],
    month: [''],
    name: ['']
  })

  showCustomerDropdown() {
    this.apiService.getCustomer().then((res: any) => {
      res['data'].push({ name: 'Select Customer', bill_no: '' })
      this.customerDropdown = res['data'] ?? [];
    }).catch((err: any) => {
      this.customerDropdown = [];
    })
  }

  reportSubmit() {
    let object: any = {
      name: this.reports.value.name,
      year: this.reports.value.year ? moment(this.reports.value.year).format('yyyy') : null,
      month: this.reports.value.month ? moment(this.reports.value.month).format('MM') : null
    }

    this.loader.loader(true);
    let object1: any = {};
    Object.keys(object).forEach((res: any) => {
      if (object[res]) {
        object1[res] = object[res];
      }
    })
    this.apiService.postReport(object1)
    .then((res: any) => {
      this.apiService.exportExcel(res.data)
      this.loader.loader(false);
      this.reports.reset();
    })
    .catch((err:any)=>{
      this.loader.loader(false);
      this.showToast('error', err.error.errors.msg);
    })
  }

  showToast(type: any, details: any) {
    this.messageService.add({ severity: type, summary: this.utility.capitalizeFirstLetter(type), detail: details });
  }
}
