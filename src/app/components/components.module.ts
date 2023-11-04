import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { DemoFlexyModule } from '../demo-flexy-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { ItemMasterComponent } from './item-master/item-master.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { PurchaseMasterComponent } from './purchase-master/purchase-master.component';
import { BillMasterComponent } from './bill-master/bill-master.component';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';
import { BillListingComponent } from './bill-listing/bill-listing.component';
import { PurchaseListingComponent } from './purchase-listing/purchase-listing.component';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    LoginComponent,
    ItemMasterComponent,
    PurchaseMasterComponent,
    BillMasterComponent,
    BillListingComponent,
    PurchaseListingComponent,
  ],
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    SharedModule,
    DashboardModule,
    CalendarModule,
    ButtonModule,
    BrowserModule,
    TableModule,
    RouterModule,
    DropdownModule
  ]
})
export class ComponentsModule { }
