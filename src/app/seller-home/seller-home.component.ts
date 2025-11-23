import { Component } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faTrash, faEdit} from '@fortawesome/free-solid-svg-icons'
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-seller-home',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './seller-home.component.html',
  styleUrl: './seller-home.component.css'
})
export class SellerHomeComponent {
  productList:undefined|product[];
  productMessage:string|undefined;
  icon=faTrash;
  editIcon=faEdit;
  constructor(private peoduct: ProductService) { }

  ngOnInit(): void {
    this.list();
  }

  deleteProduct(id:number|undefined){
    console.warn("test id",id);
    this.peoduct.deleteProduct(id as number).subscribe((result)=>{
      if(result){
        this.productMessage="Product is deleted successfully";
        this.list();
      }
    });
    setTimeout(() => {
      this.productMessage=undefined
    }, 3000);
  }
  list() {
    this.peoduct.productList().subscribe((result)=>{
      console.warn(result);
        if(result){
          this.productList=result;
        }
      });
  }
}
