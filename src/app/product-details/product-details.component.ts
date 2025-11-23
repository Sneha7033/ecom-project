import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';
import { CommonModule } from '@angular/common';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  productData:undefined| product;
  productQuantuty : number=1
  removeCart= false
  cartData: product|undefined;

  constructor(private activeRoute: ActivatedRoute, private product: ProductService) {}

  ngOnInit(): void {
    let productId= this.activeRoute.snapshot.paramMap.get('productId');
    //console.log(productId)
    productId && this.product.getProduct(productId).subscribe((result) => {
      //console.warn(result);
      this.productData=result;

      let cartData= localStorage.getItem('localCart');
      if(productId && cartData){
        let items =JSON.parse(cartData);
        items = items.filter((items:product)=>productId==items.id.toString());
        if(items.length){
          this.removeCart= true;
        }else{
          this.removeCart=false;
        }
      }

      let user = localStorage.getItem('user');

      if(user){
        let userId= user && JSON.parse(user).id;
        this.product.getCartList(userId);
        this.product.cartData.subscribe((result)=>{
          let item = result.filter((item: product)=>productId.toString()===item.productId?.toString())
          if(item.length){
            this.cartData=item[0];
            this.removeCart=true
          }
        })
      }

    });
  }
  handelQuantity(val: string){
    if(this.productQuantuty<20 && val==='plus'){
      this.productQuantuty +=1;  
    }else if(this.productQuantuty>1 && val==='min'){
      this.productQuantuty -=1;
    }
  }

  addToCart(){
    if(this.productData){
      this.productData.quantity=this.productQuantuty;
      if(!localStorage.getItem('user')){
       // console.warn(this.productData);
        this.product.localAddToCart(this.productData)
        this.removeCart=true
      }else{
        //console.warn("user is logged in");
        let user = localStorage.getItem('user');
        let userId= user && JSON.parse(user).id
        //console.warn(userId);
        let cartData: cart = {
          ...this.productData,
          userId,
          productId:this.productData.id
        }
        delete cartData.id;
        //console.warn(cartData);
        this.product.addToCart(cartData).subscribe((result)=>{
         if(result){
          this.product.getCartList(userId);
          this.removeCart=true
         }
          
        })
      }
    }
  }

  removeToCart(productId: number){
    if(!localStorage.getItem('user')){
    this.product.removeItemFromCart(productId)
   
    }else{
      
      //console.warn(this.cartData);
      this.cartData && this.product.removeToCart(this.cartData.id)
      .subscribe((result)=>{
        let user = localStorage.getItem('user');
        let userId= user && JSON.parse(user).id
        this.product.getCartList(userId);
      })
    }
    this.removeCart=false
  }
}
