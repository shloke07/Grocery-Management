import { Component } from '@angular/core';
import { GroceryService } from './grocery.service';
import {MatSnackBar} from '@angular/material/snack-bar';

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

  constructor(private service: GroceryService,private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getInventoryItems();
  }

  addToInventory(){
    this.service.addItems(this.itemsToAdd).subscribe((res:any)=>{
      const {success,message} = res;
      if(success){
        console.log(message);
        this.snackBar.open(message,'Close',{duration: 3000});
        this.itemsToAdd.length=0;
        this.getInventoryItems();
      }
      else{
        console.log(message);
        this.snackBar.open(message,'Close',{duration: 3000});

      }
    })
  }

  getInventoryItems(){
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
    this.totalItems++;
    this.clearForm();
    this.snackBar.open('Added to Cart!','Close',{duration: 3000});

    // console.log(this.itemsToAdd);
  }
  remove(e: any) {
    const index = this.itemsToAdd.findIndex((x) => x.item_id === e.item_id);
    if (index !== -1) {
      this.itemsToAdd.splice(index, 1);
      this.totalItems--;
      this.snackBar.open('Removed from Cart!','Close',{duration: 3000});

    }
  }

  clearForm(){
    this.item_name='';
    this.description='';
    this.quantity=1;
    // this.totalItems=0;
  }
}
