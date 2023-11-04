import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppUtility } from 'src/app/apputitlity';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-purchase-master',
  templateUrl: './purchase-master.component.html',
  styleUrls: ['./purchase-master.component.scss']
})
export class PurchaseMasterComponent implements OnInit {
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
    gold_rate: new FormControl('')
  })

  ngOnInit() {
    this.getItems();
    this.addProductRow('add');
  }

  addProductRow(string: any, index?: any) {
    let product = this.getProductArray();
    if (string == 'add') {
      product.push(this.FB.group({
        product_id: new FormControl('', [Validators.required]),
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

  getItems() {
    this.apiService.getAllProductList().then((res: any) => {
      console.log(res);
      this.products = res?.data;
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
    let product_control = this.getProductArray();
    console.log('---', product_control.controls[index].get('net_weight')?.value, this.product_list);

    let product_weight = 0;
    let netWeight = 0;
    if (string == 'net weight') {
      product_weight = this.product_list[index].gross_weight ? Number(this.product_list[index].gross_weight) : 0
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
        this.product_controls.controls[index].controls['total_labour'].setValue(Number(this.product_list[index].gross_weight) * Number(this.product_list[index].labour));
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

  totalRows: any = [];

  submitApi(form: any) {
    if (this.purchasingForm.valid) {
      this.utility.loader(true);
      this.getProductArray().value.forEach((res: any) => {
        res.gold_rate = this.purchasingForm.value.gold_rate
      })
      let object = {
        shop_name: this.purchasingForm.value.shop_name,
        gold_rate: this.purchasingForm.value.gold_rate,
        products: this.getProductArray().value
      }
      this.apiService.postPurchasingFormData(object).then((res: any) => {
        this.purchasingForm.reset();
        form.resetForm();
        this.utility.loader(false);
        this.showToast('success', res.message)
        this.route.navigateByUrl('/purchase-listing');
      })

        .catch((error: HttpErrorResponse) => {
          this.utility.loader(false);
          this.showToast('error', error.message)
        })
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

}
