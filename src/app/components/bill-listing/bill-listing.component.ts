import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AppUtility } from 'src/app/apputitlity';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bill-listing',
  templateUrl: './bill-listing.component.html',
  styleUrls: ['./bill-listing.component.scss']
})
export class BillListingComponent implements OnInit {
  @ViewChild('dt1') table!: Table;
  breadcrumb = [
    {
      title: "Bill List",
      subTitle: "Dashboard",
    },
  ];
  constructor(private apiService: ApiService, private utility: AppUtility) { }

  totalRows: any = [];
  productList: any = [];

  ngOnInit(): void {
    this.getProductList();
    this.getAllBills();
  }

  getAllBills() {
    this.totalRows = [];
    this.apiService.getBills()
      .then((res: any) => {
        this.totalRows = res['data'];
      })
      .catch((error: any) => {
        this.totalRows = [];
      })
  }

  getProductList() {
    this.apiService.getAllProductList().then((res: any) => {
      this.productList = res['data'];
    })
  }

  clear(table: Table) {
    table.clear();
  }

  filterval = ''
  reset(dt1: any) {
    dt1.reset();
    this.filterval = '';
  }

  filterTable(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(inputValue, 'contains')
  }

  download_file: string = '';
  getInvoice(product: any) {
    this.apiService.getInvoice(product.id)
      .then((res: any) => {
        window.open(environment.image_url + res.invoice, '_blank');
      })
  }

}
