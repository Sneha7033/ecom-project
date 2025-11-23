import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-update-product.component.html',
  styleUrl: './seller-update-product.component.css'
})
export class SellerUpdateProductComponent {
  productData: undefined|product;
  productMessage:string|undefined;

  constructor(private route: ActivatedRoute, private product:ProductService ) { }

  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id');
    //console.log(productId);
    productId && this.product.getProduct(productId as string).subscribe((data)=>{
      //console.log(data);
      this.productData=data;
    });
  } 

  submit(data: product) {
    //console.log("update product",data);
    if(this.productData){
      data.id=this.productData.id;
    }
    this.product.updateProduct(data).subscribe((result)=>{
      if(result){
        this.productMessage="Product is updated successfully";
      }
    });
    setTimeout(() => {
      this.productMessage=undefined
    }, 3000);
  }

}
