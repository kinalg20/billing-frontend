import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts/alerts.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormsComponent } from './forms/forms.component';
import { DemoFlexyModule } from '../demo-flexy-module';
import { GridListComponent } from './grid-list/grid-list.component';
import { MenuComponent } from './menu/menu.component';
import { TabsComponent } from './tabs/tabs.component';
import { ExpansionComponent } from './expansion/expansion.component';
import { ChipsComponent } from './chips/chips.component';
import { ProgressComponent } from './progress/progress.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProgressSnipperComponent } from './progress-snipper/progress-snipper.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SliderComponent } from './slider/slider.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { TooltipsComponent } from './tooltips/tooltips.component'
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { ItemMasterComponent } from './item-master/item-master.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { PurchaseMasterComponent } from './purchase-master/purchase-master.component';
import { BillMasterComponent } from './bill-master/bill-master.component';
import { DialogModuleComponent } from './dialog-module/dialog-module.component';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';
import { BillListingComponent } from './bill-listing/bill-listing.component';
import { PurchaseListingComponent } from './purchase-listing/purchase-listing.component';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AlertsComponent,
    FormsComponent,
    GridListComponent,
    MenuComponent,
    LoginComponent,
    TabsComponent,
    ExpansionComponent,
    ChipsComponent,
    ProgressComponent,
    ToolbarComponent,
    ProgressSnipperComponent,
    SnackbarComponent,
    SliderComponent,
    SlideToggleComponent,
    ButtonsComponent,
    TooltipsComponent,
    ItemMasterComponent,
    PurchaseMasterComponent,
    BillMasterComponent,
    DialogModuleComponent,
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
    RouterModule
  ],
  exports: [
    AlertsComponent,
    FormsComponent,
    GridListComponent,
    MenuComponent,
    TabsComponent,
    ExpansionComponent,
    ChipsComponent,
    ProgressComponent,
    ToolbarComponent,
    ProgressSnipperComponent,
    SnackbarComponent,
    SliderComponent,
    SlideToggleComponent,
    ButtonsComponent,
  ]
})
export class ComponentsModule { }
