import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroupDirective, Validators } from '@angular/forms';
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
  tax_dropdown: any = [];
  errorMsg: string = "";
  date: any;
  errorMsgCheck: string = "";
  myDate: any;
  loading: boolean = false;
  submitButton: string = "Submit";
  products: any = [];
  totalRows: any = [];
  product_list: any = [];
  product_controls: any = [];
  public fields: Object = { text: 'name', value: 'id' };
  
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private utility: AppUtility,
    private messageService: MessageService,
    private navigate : Router
  ) { }

  ngOnInit(): void {
    this.date = new Date();
    this.getAllProduct();
    this.addProductRow('add');
    this.getShopName(); 
    this.showCustomerDropdown();
  }

  getFormControl(control_name:any){
    return this.itemMaster.get(control_name) as FormControl
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
    name: [""],
    shop_name: [''],
    gold_rate: [''],
    bill_no: ["", [Validators.required]],
    bill_date: ["", [Validators.required]],
    father_name: ["", [Validators.required]],
    mobile: [""],
    city: ["", [Validators.required]],
    aadhar: ["", Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')],
    pan: ["", [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
    productList: this.fb.array([])
  });

  itemMasterSubmit() {
    this.itemMaster.markAllAsTouched();
    debugger;
    if (this.itemMaster.valid) {
      this.itemMaster.value.bill_date = moment(this.itemMaster.value.bill_date).format('YYYY-MM-DD');
      this.getProductArray().value.forEach((res:any)=>{
        res.gold_rate = this.itemMaster.value['gold_rate']
      })
      let object = { products: this.getProductArray().value }
      let object1 = {
        name: this.itemMaster.value['name'],
        father_name: this.itemMaster.value['father_name'],
        bill_no: this.itemMaster.value['bill_no'],
        mobile: this.itemMaster.value['mobile'],
        shop_name: this.itemMaster.value['shop_name'],
        city: this.itemMaster.value['city'],
        aadhar: this.itemMaster.value['aadhar'],
        pan: this.itemMaster.value['pan'],
        bill_date: this.itemMaster.value['bill_date'],
        gold_rate : this.itemMaster.value['gold_rate']
      }

      object1 = { ...object1, ...object }
      this.apiService.postBill(object1)
        .then((res: any) => {
          this.utility.loader(false);
          this.showToast('success', res.message);
          this.itemMaster.reset();
          this.navigate.navigateByUrl('/bill-listing');
        })
        .catch((err) => {
          this.showToast('error', err.message);
        })
    }
  }

  getProductArray() {
    return this.itemMaster.get('productList') as FormArray;
  }

  showValidation: boolean = false;
  showValidations() {
    this.showValidation = false;
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
      this.products = res.data;
      console.log(this.products);
    });
  }

  getNetWeight(string: any, index: any) {
    this.product_list = this.itemMaster.controls['productList'].value;
    this.product_controls = this.getProductArray();
    let product_control = this.getProductArray();
    let product_weight = 0;
    let netWeight = 0;
    if (string == 'net weight') {
      product_weight = this.product_list[index].weight ? Number(this.product_list[index].weight) : 0
      netWeight = (product_weight) - (((Number(this.product_list[index]?.box_quantity) ?? 0) * (Number(this.product_list[index]?.box_weight) ?? 0)) + ((Number(this.product_list[index]?.small_pack_quantity) ?? 0) * (Number(this.product_list[index]?.small_pack_weight) ?? 0)) + ((Number(this.product_list[index]?.big_pack_quantity) ?? 0) * (Number(this.product_list[index]?.big_pack_weight) ?? 0)))
      this.product_controls.controls[index].controls['net_weight'].setValue(netWeight == 0 ? 0 : netWeight)
      return netWeight == 0 ? '0' : netWeight;
    }

    else if (string == 'fine') {
      let fine = (Number(this.product_list[index].net_weight) * Number(this.product_list[index].rate)) / 100;
      this.product_controls.controls[index].controls['fine'].setValue(fine ?? 0)
      return fine == 0 ? '0' : fine;
    }

    else if (string == 'total_labour') {
      if (this.product_list[index].labour_by == 'weight') {
        this.product_controls.controls[index].controls['total_labour'].setValue(Number(this.product_list[index].weight) * Number(this.product_list[index].labour));
      }

      else {
        this.product_controls.controls[index].controls['total_labour'].setValue(Number(this.product_list[index].piece_quantity) * Number(this.product_list[index].labour));
      }

      return this.product_controls.controls[index].controls['total_labour'].value == 0 ? '0' : this.product_controls.controls[index].controls['total_labour'].value;
    }

    else {
      let value = Number(this.product_list[index].melting) + Number(this.product_list[index].wastage);
      this.product_controls.controls[index].controls['rate'].setValue(value == 0 ? 0 : value);
      return value == 0 ? '0' : value;
    }
  }

  customerDropdown: any = [];
  showCustomerDropdown() {
      this.apiService.getCustomer().then((res: any) => {
        this.customerDropdown = res['data'] ?? [];
      }).catch((err: any) => {
        this.customerDropdown = [];
      })
  }

  showToast(type: any, details: any) {
    this.messageService.add({ severity: type, summary: this.utility.capitalizeFirstLetter(type), detail: details });
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
    let product_list = this.getProductArray().value;
    if (string == 'total_fine') {
      debugger;
      product_list.forEach((res: any) => {
        total1 = total1 + res.fine;
      })
      return total1;
    }

    else if (string == 'payment') {
      let total_labour = 0;
      product_list.forEach((res: any) => {
        total1 = total1 + res.fine;
        total_labour = total_labour + res.total_labour
      })

      total3 = Number(total1 * Number(this.itemMaster.value.gold_rate)) + Number(total_labour)
      return total3;
    }

    else {
      return 0;
    }

  }



  addProductRow(string: any, index?: any) {
    let product = this.getProductArray();
    if (string == 'add') {
      product.push(this.fb.group({
        product_id: new FormControl('', [Validators.required]),
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
        piece_quantity: new FormControl(''),
        net_weight: new FormControl(3),
        rate: new FormControl(0),
        fine: new FormControl(0),
        total_labour: new FormControl(0)
      }))
    } else {
      product.removeAt(index);
    }
  }


  setFieldValues(string:any , index?:any) { 
    // if(this.checkProductDuplicate(this.itemMaster.controls['product_id'].value)){
      if (this.itemMaster.controls['name'].value && index) {
        let object = {
          bill_no: this.itemMaster.value.name,
          product_id: this.getProductArray().value[index].product_id
        }
        this.apiService.getDataByCustomerNameProductId(object)
          .then((res: any) => {
            this.getProductArray().value[index].patchValue(res.data[0]);
          }).catch((err: any) => {
          })
      }
    // }

    // else{
    //   this.showToast('error' , 'Duplicate Entry');
    //   this.itemMaster.controls['product_id'].setValue('');
    // }

  }

  shopList : any = [];
  getShopName(){
    this.apiService.getShopName().then((res:any)=>{
      console.log(res);
      this.shopList = res.data;
    });
  }
}