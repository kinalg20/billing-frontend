import { S } from "@angular/cdk/keycodes";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import { MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { AppUtility } from "src/app/apputitlity";
// import { ConfirmationService, Message } from 'primeng/api';
import { ApiService } from "src/app/services/api.service";
@Component({
  selector: "app-item-master",
  templateUrl: "./item-master.component.html",
  styleUrls: ["./item-master.component.scss"],
})
export class ItemMasterComponent implements OnInit {
  @ViewChild('dt1') table!: Table;
  tax_dropdown: any = [];
  // msgs: Message[] = [];
  errorMsg: string = "";
  date: any;
  errorMsgCheck: string = "";
  itemMasterTable: any = [];
  myDate: any;
  loading: boolean = false;
  submitButton: string = "Submit";
  productList: any = [];
  addButton : string = 'Add';
  labour_dropdown = [
    { value: 'By Piece', actualValue: 'piece' },
    { value: 'By Weight', actualValue: 'weight' }
  ]
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private utility: AppUtility,
    private messageService : MessageService
  ) {}

  ngOnInit(): void {
    this.date = new Date();
    this.getAllProduct();
  }

  breadcrumb = [
    {
      title: "Item Master",
      subTitle: "Dashboard",
    },
  ];

  itemMaster = this.fb.group({
    name: new FormControl('', [Validators.required]),
    melting: new FormControl(''),
    wastage: new FormControl(''),
    less_weight: new FormControl(''),
    gross_weight: new FormControl(''),
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
    total_labour: new FormControl(0)
  })

  itemMasterSubmit(itemMaster: FormGroupDirective) {
    if (this.itemMaster.valid) {
      this.utility.loader(true);
      if (this.submitButton == "Submit") {
        this.apiService.postProduct(this.itemMaster.value)
        .then((res: any) => {
          this.utility.loader(false);
            this.itemMaster.reset();
            this.showToast('success' , res.message)
            itemMaster.resetForm();
            this.getAllProduct();
        }).catch((err)=>{
          this.utility.loader(false);
          console.log(err.error.errors.msg);
          this.showToast('error' , err.error.errors.msg)
        })
      } 
      
      
      else { 
        let object = this.itemMaster.value;
        this.apiService.putProduct(object).then((res: any) => {
          this.utility.loader(false);
          console.log(res.status);
            // this.apiService.showMessage(res.message , 'success');
            this.itemMaster.reset();
            // Object.keys(this.itemMaster.controls).forEach((key)=>{
            //   console.log(key);
            //   this.itemMaster.controls[key].setErrors(null);
            // })
            itemMaster.resetForm();
            this.submitButton = "Submit";
            this.getAllProduct();
        });
      }
    }
  }

  getTotalStock: any = 0;
  getTotalFine: any = 0;
  product_headers: any = [
    "name",
    "purchasing_price",
    "stock",
    "fine",
    "action",
  ];
  async getAllProduct() {
    this.utility.loader(true);
    await this.apiService.getAllProductList().then((res: any) => {
      this.utility.loader(false);
      this.productList = res.data;
      console.log(this.productList);
    });
  }

  editProductId: any;
  async onClick(string: any, index: any, product: any) {
    console.log(product);
    if (string == "edit") {
      this.editProductId = product.productId;
      this.itemMaster.patchValue(product);
      this.submitButton = "Update";
      window.scroll(0, 0);
    } else {
    }
  }

  editItem(index:any) {
    // console.log(event);
    let data = this.productList[index];
    this.editProductId = this.productList[index].id;
    console.log(data);
    this.itemMaster.patchValue(data);
    this.itemMaster.controls['gross_weight'].setValue(this.productList[index].weight);
    this.submitButton = 'Update';
  }

  net_weight: Number = 0;
  rate: Number = 0;
  fine: Number = 0;
  total_labour: Number = 0;
  getNetWeight(string: any) {
    let form_values = this.itemMaster.value;
    let product_weight = 0;
    let netWeight = 0;
    if (string == 'net weight') {
      product_weight = form_values.gross_weight ? Number(form_values.gross_weight) : 0
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
        this.itemMaster.controls['total_labour'].setValue(Number(form_values.gross_weight) * Number(form_values.labour));
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

  totalRows: any = [];

  getAmount() {

  }

  showToast(type: any, details: any) {
    this.messageService.add({ severity: type, summary: this.utility.capitalizeFirstLetter(type), detail: details });
  }

  filterval = ''
  reset(dt1:any) {
    dt1.reset();
    this.filterval = '';
  }

  filterTable(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(inputValue, 'contains')
  }
}
