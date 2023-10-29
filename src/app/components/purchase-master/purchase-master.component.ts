import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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

  constructor(private FB: FormBuilder, private apiService: ApiService, private messageService: MessageService, private utility: AppUtility, private route : Router) { }

  products: any = [];

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
    product_id: new FormControl('', [Validators.required]),
    shop_name: new FormControl('', [Validators.required]),
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

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.apiService.getAllProductList().then((res: any) => {
      console.log(res);
      this.products = res?.data;
    }).catch((error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  purchasingFormSubmission(form: any) {
    if (this.purchasingForm.valid) {
      this.utility.loader(true);
      if (this.addButton == 'Add') {
        this.totalRows.push(this.purchasingForm.value);
      }
      else {
        this.totalRows[this.editRowId] = this.purchasingForm.value;
      }
      let shopName = this.purchasingForm.value.shop_name;
      this.purchasingForm.reset();
      form.resetForm();
      this.purchasingForm.controls['shop_name'].setValue(shopName ?? '');
      this.purchasingForm.controls['product_id'].setValue('');
      this.purchasingForm.controls['labour_by'].setValue('');
      this.utility.loader(false);
      this.addButton = 'Add'
    }
  }

  net_weight: Number = 0;
  rate: Number = 0;
  fine: Number = 0;
  total_labour: Number = 0;
  getNetWeight(string: any) {
    let form_values = this.purchasingForm.value;
    let product_weight = 0;
    let netWeight = 0;
    if (string == 'net weight') {
      product_weight = form_values.gross_weight ? Number(form_values.gross_weight) : 0
      netWeight = (product_weight) - (((Number(form_values?.box_quantity) ?? 0) * (Number(form_values?.box_weight) ?? 0)) + ((Number(form_values?.small_pack_quantity) ?? 0) * (Number(form_values?.small_pack_weight) ?? 0)) + ((Number(form_values?.big_pack_quantity) ?? 0) * (Number(form_values?.big_pack_weight) ?? 0)))
      this.purchasingForm.controls['net_weight'].setValue(netWeight == 0 ? 0 : netWeight)
      return netWeight == 0 ? 'Net Weight' : netWeight;
    }

    else if (string == 'fine') {
      let fine = (Number(form_values.net_weight) * Number(form_values.rate)) / 100;
      this.purchasingForm.controls['fine'].setValue(fine ?? 0)
      return fine == 0 ? 'Fine' : fine;
    }

    else if (string == 'total_labour') {
      if (form_values.labour_by == 'weight') {
        this.purchasingForm.controls['total_labour'].setValue(Number(form_values.gross_weight) * Number(form_values.labour));
      }

      else {
        this.purchasingForm.controls['total_labour'].setValue(Number(form_values.piece_quantity) * Number(form_values.labour));
      }

      return this.purchasingForm.controls['total_labour'].value == 0 ? 'Total Labour' : this.purchasingForm.controls['total_labour'].value;
    }

    else {
      let value = Number(form_values.melting) + Number(form_values.wastage);
      this.purchasingForm.controls['rate'].setValue(value == 0 ? 0 : value);
      return value == 0 ? 'Rate' : value;
    }
  }

  totalRows: any = [];

  submitApi(form: any) {
    this.utility.loader(true);
    let object = {
      shop_name: this.purchasingForm.value.shop_name,
      products: this.totalRows
    }
    this.apiService.postPurchasingFormData(object).then((res: any) => {
      this.purchasingForm.reset();
      form.resetForm();
      this.utility.loader(false);
      this.showToast('success', res.message)
      this.purchasingForm.controls['product_id'].setValue('');
      this.purchasingForm.controls['labour_by'].setValue('weight');
      this.totalRows = [];
      this.route.navigateByUrl('/purchase-listing')
    })

    .catch((error: HttpErrorResponse) => {
      console.log(error);
      this.utility.loader(false);
      this.showToast('error', error.message)
    })
  }


  getAmount(string:any) {
    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    if(string == 'total_fine'){
      this.totalRows.forEach((res:any)=>{
        total1 = total1 + res.fine;
      })
      return total1;
    }
    else if(string == 'gold_bhav'){
      this.totalRows.forEach((res:any)=>{
        total2 = total2 + res.gold_rate;
      })
      return total2;
    }

    else if(string == 'payment'){
      this.totalRows.forEach((res:any)=>{
        total1 = total1 + res.fine;
        total2 = total2 + res.gold_rate;
      })
      total3 = Number(total1 * total2) + Number(this.purchasingForm.value.total_labour)
      return total3;
    }

    else{
      return 0;
    }

  }

  showToast(type: any, details: any) {
    this.messageService.add({ severity: type, summary: this.utility.capitalizeFirstLetter(type), detail: details });
  }

  editRowId: string = '';
  addButton: string = 'Add'
  EditForm(index: any, string: any) {
    this.editRowId = index;
    debugger;
    if (string == 'edit') {
      this.addButton = 'Update';
      this.purchasingForm.patchValue(this.totalRows[index]);
    }
    else {
      this.purchasingForm.reset();
      this.addButton = 'Add'
      if (window.confirm('Are you sure you want to delete')) {
        this.totalRows.splice(this.editRowId, 1);
        this.purchasingForm.controls['product_id'].setValue('');
        this.purchasingForm.controls['labour_by'].setValue('weight');
      }
    }
  }

}
