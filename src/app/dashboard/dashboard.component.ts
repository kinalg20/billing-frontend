import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  total_sales : any = {};
  constructor(private apiService : ApiService) { }

  ngOnInit(): void {
    this.getSales();
  }

  getSales(){
    this.apiService.getSales().then((res:any)=>{
      this.total_sales = res.data;  
    })
  }

}
