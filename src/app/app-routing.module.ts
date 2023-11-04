import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './components/login/login.component';
import { ItemMasterComponent } from './components/item-master/item-master.component';
import { AuthGuard } from './gaurd/auth.guard';
import { PurchaseMasterComponent } from './components/purchase-master/purchase-master.component';
import { BillMasterComponent } from './components/bill-master/bill-master.component';
import { BillListingComponent } from './components/bill-listing/bill-listing.component';
import { PurchaseListingComponent } from './components/purchase-listing/purchase-listing.component';
import { ProductComponent } from './dashboard/dashboard-components/product/product.component';

const routes: Routes = [
  {
    path: "",
    component: FullComponent,
    children: [
      { path: "", redirectTo: "/home", pathMatch: "full" },
      { path: "home", component: DashboardComponent },
      { path: "table", component: ProductComponent },
      { path: "item-list", component: ItemMasterComponent },
      { path: "bill-master", component: BillMasterComponent },
      { path: "purchase-master", component: PurchaseMasterComponent },
      { path: "purchase-listing", component: PurchaseListingComponent },
      { path: "bill-listing", component: BillListingComponent },
    ]
  },

  { path: "login", component: LoginComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
