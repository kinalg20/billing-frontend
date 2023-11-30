import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import * as XLSX from "xlsx";
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  _baseUrl = environment.backend_api;
  constructor(private http: HttpClient, private messageService: MessageService, private primengConfig: PrimeNGConfig) { }
  ngOnInit() {
    this.primengConfig.ripple = true;
  }


  loginpost(object: any) {
    return this.http.post(this._baseUrl + 'login', object).toPromise();
  }

  postProduct(object: any) {
    return this.http.post(this._baseUrl + 'items', object).toPromise();
  }

  putProduct(object: any, product_id: any) {
    return this.http.put(this._baseUrl + 'items/' + product_id, object).toPromise();
  }

  getAllProductList() {
    return this.http.get(this._baseUrl + 'items').toPromise();
  }

  getProductById(id:any) {
    return this.http.get(this._baseUrl + 'items/'+id).toPromise();
  }

  postBill(object: any) {
    return this.http.post(this._baseUrl + 'bill', object).toPromise();
  }

  getBills() {
    return this.http.get(this._baseUrl + 'bill').toPromise();
  }


  async getCustomer() {
    let result = this.http.get(this._baseUrl + 'customers');
    return await lastValueFrom(result)
  }

  postPurchasingFormData(data: any) {
    return this.http.post(this._baseUrl + 'purchasing', data).toPromise();
  }

  getPurchasingFormData() {
    return this.http.get(this._baseUrl + 'purchasing').toPromise();
  }

  getDataByCustomerNameProductId(object: any) {
    return this.http.get(this._baseUrl + `customers/${object.bill_no}/${object.product_id}`).toPromise();
  }

  getUserProfile(id: any) {
    return this.http.get(this._baseUrl + `users/${id}`).toPromise();
  }

  getShopName() {
    return this.http.get(this._baseUrl + `shop-name`).toPromise();
  }
  
  getPurchaseShop(){
    return this.http.get(this._baseUrl + `purchasing-shop-name`).toPromise();
    
  }
  
  postReport(object:any){
    return this.http.post(this._baseUrl + `reports` , object).toPromise();
  }
  
  getLastBill(){
    return this.http.get(this._baseUrl + `last-bill`).toPromise();
  }
  
  getInvoice(bill_id : any){
    return this.http.get(this._baseUrl + `/invoices/${bill_id}`).toPromise();
  }
  
  getSales(){
    return this.http.get(this._baseUrl + `/sales`).toPromise();
  }

  exportExcel(productList: any) {
    console.log(productList);
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(productList);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "customer_report");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
