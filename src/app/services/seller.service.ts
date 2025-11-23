import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { login, SignUp } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({ 
  providedIn: 'root' 
})

export class SellerService {

  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter<boolean>(false);

  constructor(private http:HttpClient, private router: Router) { }
  userSignUp(data: SignUp) {
    let result = this.http.post('http://localhost:3000/seller', 
      data, 
      { observe: 'response' }).subscribe((result)=>{
        if(result){
        localStorage.setItem('seller', JSON.stringify(result.body));
        this.router.navigate(['seller-home']);
        }
    });
  }
  reloddSeller(){
    if(localStorage.getItem('seller')){
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }
  userLogin(data: login){
    console.warn(data);
    //api call code will be there 

    this.http.get<SignUp[]>(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
    {observe:'response'}).subscribe((result)=>{
      console.warn(result);
      if(result && result.body && result.body.length){
        localStorage.setItem('seller', JSON.stringify(result.body[0]));
        this.router.navigate(['seller-home']);
      }else{
        this.isLoginError.emit(true);
       // alert('Login failed');
      }
    });

  }

}
