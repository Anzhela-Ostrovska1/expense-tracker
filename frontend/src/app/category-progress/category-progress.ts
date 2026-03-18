import { Component, Input } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { CommonModule } from '@angular/common';
import { Transaction } from '../models/transaction.model';



@Component({
  selector: 'app-category-progress',
  imports: [CommonModule],
  templateUrl: './category-progress.html',
  styleUrl: './category-progress.scss'
})
export class CategoryProgressComponent {

  constructor(private categoryService: CategoryService) {}
 

@Input() categoriesData!:{
  category: string;
  total: number;
  percent: number;
}[];


}

