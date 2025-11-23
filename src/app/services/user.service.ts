import { EventEmitter, Injectable } from '@angular/core';
import { login, SignUp } from '../data-type';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  invalidUserAuth= new EventEmitter<boolean>(false)
  constructor(private http:HttpClient, private router:Router) { }
  userSignUp(user: SignUp) {
    //console.warn(user);
    this.http.post<any>("http://localhost:3000/users", user, { observe: 'response' })
      .subscribe(result => {
        //console.warn(result);
        if(result){
          localStorage.setItem('user', JSON.stringify(result.body))
          this.router.navigate(['/'])
        }
      });
  }

  userLogin(data: login){
    this.http.get<SignUp[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`,
      {observe: 'response'}
    ).subscribe((result )=>{
      if(result && result.body?.length){
        this.invalidUserAuth.emit(false)
        localStorage.setItem('user', JSON.stringify(result.body[0]))
        this.router.navigate(['/'])
      }else{
        this.invalidUserAuth.emit(true)
      }
    })
  }

  userAuthReload() {
    if(localStorage.getItem('user')){
      this.router.navigate(['/'])
    }
  }
}
