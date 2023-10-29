import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AppUtility } from 'src/app/apputitlity';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-bill-master',
  templateUrl: './bill-master.component.html',
  styleUrls: ['./bill-master.component.scss']
})


export class BillMasterComponent implements OnInit {
  @ViewChild('billSubmit') submitForm: ElementRef | undefined;
  tax_dropdown: any = [];
  errorMsg: string = "";
  date: any;
  errorMsgCheck: string = "";
  myDate: any;
  loading: boolean = false;
  submitButton: string = "Submit";
  productList: any = [];
  totalRows: any = [];
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private utility: AppUtility,
    public dialog: MatDialog,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private navigate : Router
  ) { }

  ngOnInit(): void {
    this.date = new Date();
    this.getAllProduct();
  }

  breadcrumb = [
    {
      title: "Bill Master",
      subTitle: "Dashboard",
    },
  ];

  labour_dropdown = [
    { value: 'By Piece', actualValue: 'piece' },
    { value: 'By Weight', actualValue: 'weight' }
  ]

  itemMaster = this.fb.group({
    name: new FormControl(""),
    product_id: new FormControl(''),
    shop_name: new FormControl(''),
    melting: new FormControl(''),
    wastage: new FormControl(''),
    less_weight: new FormControl(''),
    weight: new FormControl(''),
    small_pack_quantity: new FormControl(''),
    small_pack_weight: new FormControl(''),
    box_quantity: new FormControl(''),
    box_weight: new FormControl(''),
    big_pack_quantity: new FormControl(''),
    big_pack_weight: new FormControl(''),
    labour: new FormControl(''),
    labour_by: new FormControl('weight'),
    gold_rate: new FormControl(''),
    piece_quantity: new FormControl(''),
    net_weight: new FormControl(0),
    rate: new FormControl(0),
    fine: new FormControl(0),
    total_labour: new FormControl(0),
    bill_no: new FormControl("", [Validators.required]),
    bill_date: new FormControl("", [Validators.required]),
    father_name: new FormControl("", [Validators.required]),
    mobile: new FormControl("", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    aadhar: new FormControl("", Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')),
    pan: new FormControl("", [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]),
  });

  itemMasterSubmit(itemMaster: FormGroupDirective) {
    console.log(itemMaster.valid, this.itemMaster)
    if (this.itemMaster.valid) {
      this.itemMaster.value.bill_date = moment(this.itemMaster.value.bill_date).format('YYYY-MM-DD');

      let object = { products: this.totalRows }
      let object1 = {
        name: this.itemMaster.value['name'],
        father_name: this.itemMaster.value['father_name'],
        bill_no: this.itemMaster.value['bill_no'],
        mobile: this.itemMaster.value['mobile'],
        shop_name: this.itemMaster.value['shop_name'],
        city: this.itemMaster.value['city'],
        aadhar: this.itemMaster.value['aadhar'],
        pan: this.itemMaster.value['pan'],
        bill_date: this.itemMaster.value['bill_date']
      }

      object1 = { ...object1, ...object }
      this.apiService.postBill(object1)
        .then((res: any) => {
          this.utility.loader(false);
          this.showToast('success', res.message);
          this.itemMaster.reset();
          this.totalRows = [];
          this.navigate.navigateByUrl('/bill-listing');
        })
        .catch((err) => {
          this.showToast('Error', err.message);
        })
    }
  }

  showValidation: boolean = false;
  showValidations() {
    this.showValidation = false;
    if (!this.itemMaster.value['product_id']) {
      this.showValidation = true;
    }
    if (!this.showValidation) {
      if (this.addButton == 'Add') {
        this.totalRows.push(this.itemMaster.value);
      }

      else {
        this.totalRows[this.editRowId] = this.itemMaster.value;
      }
      this.itemMaster.reset();
      this.itemMaster.controls['bill_no'].setValue(this.totalRows[this.totalRows.length - 1].bill_no)
      this.itemMaster.controls['bill_date'].setValue(this.totalRows[this.totalRows.length - 1].bill_date)
      this.itemMaster.controls['name'].setValue(this.totalRows[this.totalRows.length - 1].name)
      this.itemMaster.controls['father_name'].setValue(this.totalRows[this.totalRows.length - 1].father_name)
      this.itemMaster.controls['mobile'].setValue(this.totalRows[this.totalRows.length - 1].mobile)
      this.itemMaster.controls['shop_name'].setValue(this.totalRows[this.totalRows.length - 1].shop_name)
      this.itemMaster.controls['city'].setValue(this.totalRows[this.totalRows.length - 1].city)
      this.itemMaster.controls['aadhar'].setValue(this.totalRows[this.totalRows.length - 1].aadhar)
      this.itemMaster.controls['pan'].setValue(this.totalRows[this.totalRows.length - 1].pan)
      this.itemMaster.controls['labour_by'].setValue('weight')
      this.itemMaster.controls['product_id'].setValue('')
      this.showValidation = false;
      this.addButton = 'Add'
    }
  }

  getTotalStock: any = 0;
  getTotalFine: any = 0;

  billsList: any = [];
  async getAllProduct() {
    this.utility.loader(true);
    await this.apiService.getAllProductList().then((res: any) => {
      this.utility.loader(false);
      this.productList = res.data;
      console.log(this.productList);
    });
  }

  getNetWeight(string: any) {
    let form_values = this.itemMaster.value;
    let product_weight = 0;
    let netWeight = 0;
    if (string == 'net weight') {
      product_weight = form_values.weight ? Number(form_values.weight) : 0
      netWeight = (product_weight) - (((Number(form_values?.box_quantity) ?? 0) * (Number(form_values?.box_weight) ?? 0)) + ((Number(form_values?.small_pack_quantity) ?? 0) * (Number(form_values?.small_pack_weight) ?? 0)) + ((Number(form_values?.big_pack_quantity) ?? 0) * (Number(form_values?.big_pack_weight) ?? 0)))
      this.itemMaster.controls['net_weight'].setValue(netWeight == 0 ? 0 : netWeight)
      return netWeight == 0 ? 'Net Weight' : netWeight;
    }

    else if (string == 'fine') {
      let fine = (Number(form_values.net_weight) * Number(form_values.rate)) / 100;
      this.itemMaster.controls['fine'].setValue(fine ?? 0)
      return fine == 0 ? 'Fine' : fine;
    }

    else if (string == 'total_labour') {
      if (form_values.labour_by == 'weight') {
        this.itemMaster.controls['total_labour'].setValue(Number(form_values.weight) * Number(form_values.labour));
      }

      else {
        this.itemMaster.controls['total_labour'].setValue(Number(form_values.piece_quantity) * Number(form_values.labour));
      }

      return this.itemMaster.controls['total_labour'].value == 0 ? 'Total Labour' : this.itemMaster.controls['total_labour'].value;
    }

    else {
      let value = Number(form_values.melting) + Number(form_values.wastage);
      this.itemMaster.controls['rate'].setValue(value == 0 ? 0 : value);
      return value == 0 ? 'Rate' : value;
    }
  }

  customerDropdown: any = [];
  showCusDropdown: boolean = false;
  showCustomerDropdown(event: any) {
    if (event.target.checked) {
      this.apiService.getCustomer().then((res: any) => {
        console.log(res);
        this.showCusDropdown = true;
        this.customerDropdown = res['data'] ?? [];
      }).catch((err: any) => {
        this.customerDropdown = [];
        this.showCusDropdown = false;
      })
    }

    else {
      this.customerDropdown = [];
      this.showCusDropdown = false;
    }
  }

  showToast(type: any, details: any) {
    this.messageService.add({ severity: type, summary: this.utility.capitalizeFirstLetter(type), detail: details });
  }


  setFieldValues(event?: any) { 
    if(this.checkProductDuplicate(this.itemMaster.controls['product_id'].value)){
      if (this.itemMaster.controls['name'].value && this.itemMaster.controls['product_id'].value) {
        console.log(JSON.stringify(this.itemMaster.controls['name'].value), this.itemMaster.controls['product_id'].value)
        let object = {
          bill_no: this.itemMaster.value.name,
          product_id: this.itemMaster.value.product_id
        }
        this.apiService.getDataByCustomerNameProductId(object)
          .then((res: any) => {
            this.itemMaster.patchValue(res.data[0]);
            this.itemMaster.controls['less_weight'].setValue('Less Weight')
          }).catch((err: any) => {
  
          })
      }
    }

    else{
      this.showToast('error' , 'Duplicate Entry');
      this.itemMaster.controls['product_id'].setValue('');
    }

  }

  checkProductDuplicate(product_id:any){
    let result = true;
    this.totalRows.forEach((res:any)=>{
        if(res.product_id == product_id){
          result = false;
        }
    })
    return result;
  }

  addButton: string = 'Add'
  triggerSubmitButton() {
    this.cdr.detectChanges();
    let e1 = this.submitForm?.nativeElement;
    e1?.click();
  }

  editRowId: string = '';
  EditForm(index: any, string: any) {
    this.editRowId = index;
    if (string == 'edit') {
      this.addButton = 'Update';
      this.itemMaster.patchValue(this.totalRows[index]);
    }

    else {
      // this.itemMaster.reset();
      this.addButton = 'Add'
      if (window.confirm('Are you sure you want to delete')) {
        this.totalRows.splice(this.editRowId, 1);
      }
    }
  }

  getAmount(string: any) {
    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    if (string == 'total_fine') {
      this.totalRows.forEach((res: any) => {
        total1 = total1 + res.fine;
      })
      return total1;
    }
    else if (string == 'gold_bhav') {
      this.totalRows.forEach((res: any) => {
        total2 = total2 + res.gold_rate;
      })
      return total2;
    }

    else if (string == 'payment') {
      this.totalRows.forEach((res: any) => {
        total1 = total1 + res.fine;
        total2 = total2 + res.gold_rate;
      })
      total3 = Number(total1 * total2) + Number(this.itemMaster.value.total_labour)
      return total3;
    }

    else {
      return 0;
    }

  }
}