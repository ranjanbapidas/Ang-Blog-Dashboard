import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';



@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoryArray: Array<any> = [];
  formCategory!:string;
  formStatus:string= 'Add';
  categoryId:string='';

  constructor(private categoryService: CategoriesService) {

  }
  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      console.log(val);
      this.categoryArray=val;
    });
  }
  addCategory() {

  }
  onSubmit(formData: any) {

    let categoryData: Category = {
      category: formData.value.category
    }
    
    if(this.formStatus=='Add') {
      this.categoryService.saveData(categoryData);
      
    }else if(this.formStatus=='Edit'){
      this.categoryService.updateData(this.categoryId, categoryData);
      this.formStatus='Add';
    }
    formData.reset();
    
    

    // this.afs.collection('categories').add(categoryData).then(docRef => {
    //   console.log(docRef);
    //   this.afs.collection('categories').doc(docRef.id).collection('subCategories').add(subCategoryData).then(docRef1 => {
    //     console.log(docRef1);
    //     this.afs.doc(`/categories/${docRef.id}/subCategories/${docRef1.id}`).collection('subSubCategories').add(categoryData).then(
    //       docref3=>{
    //         console.log('print successfull');
    //       }
    //     )
    //     this.afs.collection('categories').doc(docRef.id).collection('subCategories').doc(docRef1.id).
    //       collection('subSubCategories').add(subCategoryData).then(docref2 => {
    //         console.log('Second Level Sub Category Saved Successfully');
    //       })
    //   })
    // }).catch(err => {
    //   console.log(err);
    // });
  }
  onEdit(category:any,id:any){
      this.formCategory=category;
      this.formStatus='Edit'
      this.categoryId=id;
  }
  
  onDelete(id:any) {
    this.categoryService.deleteData(id);
    
  }
  
}
