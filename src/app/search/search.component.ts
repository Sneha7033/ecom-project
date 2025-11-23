import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchResult: product[] = [];

  constructor(private activeRoute: ActivatedRoute,
              private productService: ProductService) {}

  ngOnInit(): void {
    const query = this.activeRoute.snapshot.paramMap.get('query');

    if (query) {
      this.productService.searchProducts(query).subscribe((result) => {
        this.searchResult = result;
      });
    }
  }
}
