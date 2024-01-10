import { Component } from '@angular/core';
import { GroceryService } from './grocery.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'grocery-app';


  items: any[] = [];
  itemsToAdd: any[] = [];
  item_name:string='';
  description:string='';
  quantity:number=1;
  totalItems:number=0;

  constructor(private service: GroceryService) {}

  ngOnInit() {
    this.service.getItems().subscribe((res: any) => {
      this.items = res.items;
      this.totalItems=this.items.length;
      console.log(this.totalItems);
      
    });
  }

  addToCart() {
    let obj={
      "item_id":this.totalItems+1,
      "item_name":this.item_name,
      "description":this.description,
      "quantity":this.quantity
    }
    console.log('hello');
    this.itemsToAdd.push(obj);
    // console.log(this.itemsToAdd);
  }
  remove(e: any) {
    const index = this.itemsToAdd.findIndex((x) => x.item_id === e.item_id);
    if (index !== -1) {
      this.itemsToAdd.splice(index, 1);
    }
  }

  clearForm(){

  }
}
