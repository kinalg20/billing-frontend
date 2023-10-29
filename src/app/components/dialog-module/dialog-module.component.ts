import { Component, Inject, Input, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-dialog-module',
  templateUrl: './dialog-module.component.html',
  styleUrls: ['./dialog-module.component.scss']
})
export class DialogModuleComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    console.log(this.data)
  }

  displayedColumns: string[] = ['item_name', 'weight' , 'tanch'];
  dataSource = this.data.bill_items;

}
