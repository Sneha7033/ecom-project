import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { cart, login, product, SignUp } from '../data-type';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class UserAuthComponent {
  showLogin:boolean= true;
  authError:string="";
  constructor(private user:UserService, private product: ProductService){}
  
  ngOnInit():void {
  
    this.user.userAuthReload();
  }

  signUp(data:SignUp){
    //console.warn(data)
    this.user.userSignUp(data)
  }

  login(data: login){
    this.user.userLogin(data)
    this.user.invalidUserAuth.subscribe((result)=>{
      //console.warn("apple",result);
      if(result){
        this.authError="Please enter valid user details"
      }else{
        this.localCartToRemoteCart()
      }
    })
    
  }

  openSignUp(){
    this.showLogin=false
  }

  openLogin() {
    this.showLogin=true
  }

  localCartToRemoteCart(){
    let data= localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId= user && JSON.parse(user).id;
    if(data){
      let cartDataList: product[]=JSON.parse(data);
     
      interface CartPayload {
        productId: number;
        userId: number | null;
        [key: string]: any;
      }

      cartDataList.forEach((productItem: product, index: number) => {
        const cartData: cart & CartPayload = {
          ...productItem,
          productId: productItem.id,
          userId
        };

        delete (cartData as any).id;
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result: unknown) => {
            if (result) {
              console.warn("item stored in db");
            }
          });
          if (cartDataList.length === index + 1) {
            localStorage.removeItem('localCart');
          }
        }, 500);
      });
    }

    setTimeout(()=>{
      this.product.getCartList(userId);
    },2000);

  }
}
