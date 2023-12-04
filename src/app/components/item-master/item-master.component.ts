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
  showAddForm: boolean = false;
  errorMsgCheck: string = "";
  itemMasterTable: any = [];
  myDate: any;
  loading: boolean = false;
  submitButton: string = "Submit";
  productList: any = [];
  addButton: string = 'Add';
  labour_dropdown = [
    { value: 'By Piece', actualValue: 'piece' },
    { value: 'By Weight', actualValue: 'weight' }
  ]
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private utility: AppUtility,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.date = new Date();
    this.getAllProduct();
  }

  breadcrumb = [
    {
      title: "Stock ",
      subTitle: "Dashboard",
    },
  ];

  itemMaster = this.fb.group({
    name: new FormControl('', [Validators.required]),
    weight: new FormControl(0),
    melting: new FormControl(0),
    wastage: new FormControl(0),
    labour: new FormControl(0),
    purchasing_price: new FormControl('0'),
    fine: new FormControl(0),
    less_weight: new FormControl(0),
    small_pack_quantity: new FormControl(''),
    small_pack_weight: new FormControl(''),
    box_quantity: new FormControl(''),
    box_weight: new FormControl(''),
    big_pack_quantity: new FormControl(''),
    big_pack_weight: new FormControl(''),
    gross_weight: new FormControl(0),
    total_labour: new FormControl(0),
    sell_labour: new FormControl(0),
    sell_rate: new FormControl(0),
    sell_fine: new FormControl(0),
    total_sell_labour: new FormControl(0),
    profit_fine: new FormControl(0),
    stock: new FormControl(0)

    // labour_by: new FormControl('weight'),
    // gold_rate: new FormControl(''),
    // piece_quantity: new FormControl(''),
    // rate: new FormControl(0),
  })

  itemMasterSubmit(itemMaster: FormGroupDirective) {
    if (this.itemMaster.valid) {
      this.utility.loader(true);
      if (this.submitButton == "Submit") {
        this.apiService.postProduct(this.itemMaster.value)
          .then((res: any) => {
            this.utility.loader(false);
            this.itemMaster.reset();
            this.showToast('success', res.message)
            itemMaster.resetForm();
            this.itemMasterTable.controls['labour_by'].setValue('weight')
            this.getAllProduct();
          })

          .catch((err) => {
            this.utility.loader(false);
            console.log(err.error.errors.msg);
            this.showToast('error', err.error.errors.msg)
          })
      }


      else {
        let object = this.itemMaster.value;
        this.apiService.putProduct(object, this.editProductId)
          .then((res: any) => {
            this.utility.loader(false);
            console.log(res.status);
            this.showToast(res.message, 'success');
            this.itemMaster.reset();
            // Object.keys(this.itemMaster.controls).forEach((key)=>{
            //   console.log(key);
            //   this.itemMaster.controls[key].setErrors(null);
            // })
            itemMaster.resetForm();
            this.submitButton = "Submit";
            this.getAllProduct();
          })
          .catch((err) => {
            this.showToast(err.error.errors.message, 'error');
            this.utility.loader(false);
          })
        }
        
      }
      this.itemMaster.controls['purchasing_price'].setValue('0')
      this.itemMaster.controls['fine'].setValue(0)
      this.itemMaster.controls['gross_weight'].setValue(0)
      this.itemMaster.controls['total_labour'].setValue(0)
      this.itemMaster.controls['profit_fine'].setValue(0)
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
    })
      .catch((err) => {
        this.utility.loader(false);
      })
  }

  editProductId: any;

  editItem(index: any) {
    console.log(index);
    // console.log(event);
    let data = this.productList[index];
    this.editProductId = this.productList[index].id;
    console.log(data);
    this.itemMaster.patchValue(data);
    this.itemMaster.controls['weight'].setValue(this.productList[index].weight);
    this.submitButton = 'Update';
  }

  totalRows: any = [];

  showToast(type: any, details: any) {
    this.messageService.add({ severity: type, summary: this.utility.capitalizeFirstLetter(type), detail: details });
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

  calculateValues(string?: any) {
    // let item_data = this.itemMasterTable.controls;
    if (string == 'purchasing_price' && this.itemMaster.controls['melting'].value && this.itemMaster.controls['wastage'].value) {
      let price = Number((this.itemMaster.controls['melting'].value ? this.itemMaster.controls['melting'].value : 0)) + Number((this.itemMaster.controls['wastage'].value ? this.itemMaster.controls['wastage'].value : 0));
      this.itemMaster.controls['purchasing_price'].setValue(String(price));
    }

    if (this.itemMaster.controls['weight'].value) {
      if (this.itemMaster.controls['purchasing_price'].value) {
        let price = ((Number((this.itemMaster.controls['purchasing_price'].value ? this.itemMaster.controls['purchasing_price'].value : 0)) * Number((this.itemMaster.controls['weight'].value ? this.itemMaster.controls['weight'].value : 0))) / 100);
        this.itemMaster.controls['fine'].setValue(price);
      }
      let price = (Number((this.itemMaster.controls['small_pack_quantity'].value ? this.itemMaster.controls['small_pack_quantity'].value : 0)) * Number((this.itemMaster.controls['small_pack_weight'].value ? this.itemMaster.controls['small_pack_weight'].value : 0)) +

        (Number((this.itemMaster.controls['big_pack_quantity'].value ? this.itemMaster.controls['big_pack_quantity'].value : 0)) * Number((this.itemMaster.controls['big_pack_weight'].value ? this.itemMaster.controls['big_pack_weight'].value : 0))) +

        (Number((this.itemMaster.controls['box_quantity'].value ? this.itemMaster.controls['box_quantity'].value : 0)) * Number((this.itemMaster.controls['box_weight'].value ? this.itemMaster.controls['box_weight'].value : 0)))
      )

        + Number(this.itemMaster.controls['weight'].value)

      this.itemMaster.controls['gross_weight'].setValue(price);
    }

    if (this.itemMaster.controls['gross_weight'].value && this.itemMaster.controls['labour'].value) {
      let price: any = (Number(this.itemMaster.controls['gross_weight'].value) * (Number(this.itemMaster.controls['labour'].value)))
      this.itemMaster.controls['total_labour'].setValue(price);
    }

    if (this.itemMaster.controls['sell_rate'].value) {
      let price: any = (Number(this.itemMaster.controls['sell_rate'].value) * (Number(this.itemMaster.controls['weight'].value))) / 100
      this.itemMaster.controls['sell_fine'].setValue(price);
    }

    if (this.itemMaster.controls['sell_labour'].value && this.itemMaster.controls['gross_weight'].value) {
      let price: any = (Number(this.itemMaster.controls['sell_labour'].value) * (Number(this.itemMaster.controls['gross_weight'].value)))
      this.itemMaster.controls['total_sell_labour'].setValue(price);
    }

    if (this.itemMaster.controls['sell_fine'].value && this.itemMaster.controls['fine'].value) {
      let price = this.itemMaster.controls['sell_fine'].value - this.itemMaster.controls['fine'].value;
      this.itemMaster.controls['profit_fine'].setValue(price);
    }
  }
}
