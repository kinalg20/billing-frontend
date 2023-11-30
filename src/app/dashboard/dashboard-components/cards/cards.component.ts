import { Component, Input, OnChanges, OnInit } from '@angular/core';

interface cards {
  image: string;
  btn: string;
  count : number,
  title : string
}

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
})
export class CardsComponent implements OnInit , OnChanges{

  @Input() total_sales : any = 0;
  constructor() { }
  cards: cards [] = [
    {
      image: "assets/images/u2.webp",
      btn: "btn-danger",
      count : 0,
      title : 'Total Sale'
    },
    {
      image: "assets/images/u3.webp",
      btn: "btn-warning",
      count : 0,
      title : 'Total Sale'
    },
    {
      image: "assets/images/u4.webp",
      btn: "btn-info",
      count : 0,
      title : 'Total Sale'
    },
  ]

  ngOnInit(): void {  
  }

  ngOnChanges():void{
    this.total_sales.forEach((res:any , index:any)=>{
      this.cards[index].count = res.total_sales;
    })
  }


}
