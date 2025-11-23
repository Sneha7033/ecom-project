import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { SignUp } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './seller-auth.component.html',
  styleUrl: './seller-auth.component.css'
})
export class SellerAuthComponent {
  constructor(private seller: SellerService, private router:Router){}
  showLogin=false;
  authError :string= "";
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.seller.reloddSeller();
  }
  signUp(data: SignUp): void {
   // console.warn(data);
    this.seller.userSignUp(data)
  }

  login(data: SignUp): void {
    this.authError="";
    //console.warn(data);
    this.seller.userLogin(data);
    this.seller.isLoginError.subscribe((isError)=>{
      if(isError){
        this.authError="Email or Password is incorrect";
        //alert('Please enter valid login details');
      }
    });
  }

  openLogin(){
    this.showLogin=true;
  }
  openSignUp(){
    this.showLogin=false;
  }


}
