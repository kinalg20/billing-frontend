import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AppUtility } from 'src/app/apputitlity';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-purchase-master',
  templateUrl: './purchase-master.component.html',
  styleUrls: ['./purchase-master.component.scss']
})
export class PurchaseMasterComponent implements OnInit {
  date: any;
  constructor(private FB: FormBuilder, private apiService: ApiService, private messageService: MessageService, private utility: AppUtility, private route: Router) { }

  products: any = [];
  public fields: Object = { text: 'name', value: 'id' };
  breadcrumb = [
    {
      title: "Purchasing Master",
      subTitle: "Dashboard",
    },
  ];

  labour_dropdown = [
    { value: 'By Piece', actualValue: 'piece' },
    { value: 'By Weight', actualValue: 'weight' }
  ]

  purchasingForm = this.FB.group({
    productList: this.FB.array([]),
    shop_name: new FormControl('', [Validators.required]),
    bill_no: new FormControl('', [Validators.required]),
    bill_date: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    gold_rate: new FormControl('')
  })

  ngOnInit() {
    this.getItems();
    this.addProductRow('add', '', 20);
    this.getShopName();
    this.date = new Date();
    this.purchasingForm.controls['bill_date'].setValue(this.date);
  }

  addProductRow(string: any, index?: any, rows?: any) {
    let product = this.getProductArray();
    if (string == 'add') {
      for (let i = 0; i < rows; i++) {
        product.push(this.FB.group({
          product_id: new FormControl(''),
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
          piece_quantity: new FormControl('0'),
          weight: new FormControl(0),
          rate: new FormControl(0),
          fine: new FormControl(0),
          total_labour: new FormControl(0)
        }))
      }
    } else {
      product.removeAt(index);
    }

  }

  product_listing : any = [];
  getItems() {
    this.apiService.getAllProductList().then((res: any) => {
      console.log(res);
      this.products = res?.data;
      this.product_listing = res.data;
    }).catch((error: HttpErrorResponse) => {
      console.log(error);
    })
  }


  net_weight: Number = 0;
  rate: Number = 0;
  fine: Number = 0;
  total_labour: Number = 0;
  product_list: any = [];
  product_controls: any = [];
  getNetWeight(string: any, index: any) {
    this.product_list = this.purchasingForm.controls['productList'].value ?? [];
    this.product_controls = this.getProductArray();

    let product_weight = 0;
    let netWeight = 0;
    if (string == 'net weight' || string == '') {
      product_weight = this.product_list[index].gross_weight ? Number(this.product_list[index].gross_weight) : 0
      netWeight = (product_weight) - (((Number(this.product_list[index]?.box_quantity) ?? 0) * (Number(this.product_list[index]?.box_weight) ?? 0)) + ((Number(this.product_list[index]?.small_pack_quantity) ?? 0) * (Number(this.product_list[index]?.small_pack_weight) ?? 0)) + ((Number(this.product_list[index]?.big_pack_quantity) ?? 0) * (Number(this.product_list[index]?.big_pack_weight) ?? 0)))
      this.product_controls.controls[index].controls['weight'].setValue(netWeight == 0 ? 0 : netWeight)
      // return netWeight == 0 ? '0' : netWeight;
    }

    if (string == 'total_labour' || string == '') {
      if (this.product_list[index].labour_by == 'weight') {
        this.product_controls.controls[index].controls['total_labour'].setValue(Number(this.product_list[index].gross_weight) * Number(this.product_list[index].labour));
      }

      else {
        this.product_controls.controls[index].controls['total_labour'].setValue(Number(this.product_list[index].piece_quantity) * Number(this.product_list[index].labour));
      }

      // return this.product_controls.controls[index].controls['total_labour'].value == 0 ? '0' : this.product_controls.controls[index].controls['total_labour'].value;
    }

    if(string == '') {
      let value = Number(this.product_list[index].melting) + Number(this.product_list[index].wastage);
      this.product_controls.controls[index].controls['rate'].setValue(value == 0 ? 0 : value);
      // return value == 0 ? '0' : value;
    }

    if (string == 'fine' || string == '') {
      let fine = (Number(this.product_list[index].weight) * Number(this.product_list[index].rate)) / 100;
      this.product_controls.controls[index].controls['fine'].setValue(fine ?? 0)
      // return fine == 0 ? '0' : fine;
    }
  }

  totalRows: any = [];

  submitApi(form: any) {
    this.purchasingForm.markAllAsTouched();
    console.log(!Number(this.getProductArray().value[0].product_id) , this.purchasingForm.value.shop_name);
    if (this.purchasingForm.valid) {
      this.utility.loader(true);
      let products: any = [];
      this.purchasingForm.value.bill_date = moment(this.purchasingForm.value.bill_date).format('YYYY-MM-DD');
      let shopName : any = this.purchasingForm.value.shop_name
      this.getProductArray().value.forEach((res: any) => {
        if (res.product_id) {
          debugger;
          let object = Object.assign({} , res);
          let productId = typeof this.getProductArray().value[0].product_id == 'string' ? this.getProductArray().value[0].product_id : this.getProductArray().value[0].product_id['id']
          if (!Number(productId)) {
            object['product_name'] = productId;
            delete object['product_id'];
          } else{
            object['product_id'] = productId
          }
          products.push(object);
          object.gold_rate = this.purchasingForm.value.gold_rate
        }
      })

      let object = {
        shop_name: typeof shopName == 'string' ? shopName : shopName['shop_name'],
        gold_rate: this.purchasingForm.value.gold_rate,
        bill_no: this.purchasingForm.value.bill_no,
        bill_date: this.purchasingForm.value.bill_date,
        city: this.purchasingForm.value.city,
        products: products
      }
      this.apiService.postPurchasingFormData(object).then((res: any) => {
        this.purchasingForm.reset();
        form.resetForm();
        this.utility.loader(false);
        this.showToast('success', res.message)
        this.route.navigateByUrl('/purchase-listing');
      })

        .catch((error) => {
          this.utility.loader(false);
          this.showToast('error', error.errors.msg);
        })
    }
    else {
      this.showToast('error', 'please fill required fields')
    }
  }


  getAmount(string: any) {
    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    let product_list = this.getProductArray().value;
    if (string == 'total_fine') {
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

      total3 = Number(total1 * Number(this.purchasingForm.value.gold_rate)) + Number(total_labour)
      return total3;
    }

    else {
      return 0;
    }

  }

  showToast(type: any, details: any) {
    this.messageService.add({ severity: type, summary: this.utility.capitalizeFirstLetter(type), detail: details });
  }

  editRowId: string = '';
  addButton: string = 'Add'

  getProductArray() {
    return this.purchasingForm.get('productList') as FormArray;
  }


  setProductMelting(index: any) {
    if (this.getProductArray().value[index].product_id) {
      let productId: any = typeof this.getProductArray().value[index].product_id == 'string' ? this.getProductArray().value[index].product_id : this.getProductArray().value[index].product_id['id'];
      if(Number(productId)){
        this.apiService.getProductById(productId).then((res: any) => {
          let data = res.data;
          this.product_controls = this.getProductArray();
          this.product_controls.controls[index].controls['melting'].setValue(data.melting);
        })
          .catch((err: any) => {
          })
      }

      else{
        this.product_controls.controls[index].controls['melting'].setValue('');
      }
    }

  }

  shopList : any = [];
  shopDataList : any = [];
  getShopName() {
    this.apiService.getPurchaseShop()
      .then((res: any) => {
        console.log(res);
        this.shopList = res.data;
      }).catch((err) => {
        this.shopList = [];
      })

    this.shopDataList = this.shopList;
  }

  filterShop(event: any, key: any) {
    var filtered: any[] = [];
    let query = event.query;
    if (key == 'shop_name') {
      for (let i = 0; i < this.shopList.length; i++) {
        if (this.shopList[i][key].toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(this.shopList[i]);
        }
      }

      this.shopDataList = filtered;
    }

    else if(key == 'name'){
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i][key].toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(this.products[i]);
        }
      }

      this.product_listing = filtered;
    }
  }

  checkTotal(event:any , index:any){
    this.product_controls = this.getProductArray()
    let labour_by = event.target.value;
    var total_labour = 0;
    if (labour_by == 'weight') {
      this.product_controls.controls[index].controls['total_labour'].setValue(Number(this.product_list[index].gross_weight) * Number(this.product_list[index].labour));
    }

    else {
      this.product_controls.controls[index].controls['total_labour'].setValue(Number(this.product_list[index].piece_quantity) * Number(this.product_list[index].labour));
    }
  }
}
