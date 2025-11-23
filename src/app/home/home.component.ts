import { Component, OnInit } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

import { CommonModule } from '@angular/common';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule,  NgbCarouselModule, NgForOf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  popularProducts: undefined| product[];
  trendyProducts: undefined | product[]
  constructor(private product: ProductService) { }

  ngOnInit(): void {
    this.product.popularProducts().subscribe((data)=>{
      console.warn("popular products",data);
      this.popularProducts=data;
    });

    this.product.trendyProducts().subscribe((data)=>{
      this.trendyProducts= data;
    });
  } 

}
