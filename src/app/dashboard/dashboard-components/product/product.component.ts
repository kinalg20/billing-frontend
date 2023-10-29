import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';

export interface PeriodicElement {
  id: number;
  name: string;
  purchasing_price: string;
  project: string;
  priority: string;
  badge: string;
  budget: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, name: 'Deep Javiya', purchasing_price: 'Frontend Devloper', project: 'Flexy Angular', priority: 'Low', badge: 'badge-info', budget: '$3.9k' },
  { id: 2, name: 'Nirav Joshi', purchasing_price: 'Project Manager', project: 'Hosting Press HTML', priority: 'Medium', badge: 'badge-primary', budget: '$24.5k' },
  { id: 3, name: 'Sunil Joshi', purchasing_price: 'Web Designer', project: 'Elite Admin', priority: 'High', badge: 'badge-danger', budget: '$12.8k' },
  { id: 4, name: 'Maruti Makwana', purchasing_price: 'Backend Devloper', project: 'Material Pro', priority: 'Critical', badge: 'badge-success', budget: '$2.4k' },
];


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() displayedColumns: string[] = ['name', 'purchasing_price', 'stock', 'fine', 'action'];
  @Input() dataSource : any = ELEMENT_DATA;
  @Output() editProduct = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void {
  }

  editForm(element:any){
    this.editProduct.emit(element);
  }

}
