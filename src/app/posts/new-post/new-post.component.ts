import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit{
  permalink: string = '';
  imgSrc : any = './assets/Image/image-placeholder.jpg';
  selectedImage:any ;
  categories!: Array<any>;
  postForm !: FormGroup;
  post:any;
  formStatus: string = 'Add New';
  docId!: string;


  constructor( private categoryService:CategoriesService,
     private fb : FormBuilder, 
     private postService: PostsService,
     private route: ActivatedRoute ) {

      this.route.queryParams.subscribe(val=>{
        this.docId=val.id;

        if(this.docId){
          this.postService.loadOneData(val.id).subscribe(post=>{
            console.log("Ranjan");
            console.log(post);
            this.post = post;
            //this.fc.permalinks.enable();
            this.postForm = this.fb.group({
              title: [this.post.title, [Validators.required, Validators.minLength(10)]],
              permalinks: [{value:this.post.permalink,disabled:true}, Validators.required],
              excerpt: [this.post.excerpt, [Validators.required, Validators.minLength(50)]],
              category: [`${this.post.category.categoryId}-${this.post.category.category}`, Validators.required],
              postImg: ['', Validators.required],
              content: [this.post.content, Validators.required]
            });
  
            this.imgSrc = this.post.postImgPath;
            this.formStatus='Edit';
          });
        } else {
          this.postForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(10)]],
            permalinks: [{value:'',disabled:true}, Validators.required],
            excerpt: ['', [Validators.required, Validators.minLength(50)]],
            category: ['', Validators.required],
            postImg: ['', Validators.required],
            content: ['', Validators.required]
          });

        }

        
      });
  }
  ngOnInit(): void {
    //this.fc.permalinks.disable();
    this.categoryService.loadData().subscribe(
      val=>{
        this.categories=val;
      }
    );
  }

  get fc(){
    return this.postForm.controls;
  }
  onTitleChange($event: any) {
    //console.log($event.target.value);
    const title = $event.target.value;
    this.permalink=title.replace(/\s/g,'-');
    //console.log(this.permalink);
  }

  showPreview($event:any){
    const reader = new FileReader();
    reader.onload = (e) =>{
      this.imgSrc = e.target?.result;
    }
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImage=$event.target.files[0];
  }

  onSubmit() {
    let splited = this.postForm.value.category.split('-');
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.permalink,
      category: {
        categoryId: splited[0],
        category: splited[1]
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    }
    //console.log(this.postForm.value);
    console.log(postData);
    this.postService.uploadImage(this.selectedImage, postData, this.formStatus, this.docId);
    this.postForm.reset();
    this.imgSrc= './assets/Image/image-placeholder.jpg';
    
  }

  

}
