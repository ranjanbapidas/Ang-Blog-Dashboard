import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit {

  postArray!: Array<any> ;

  constructor(private postService: PostsService) {

  }

  ngOnInit(): void {
    this.postService.loadData().subscribe(val=>{
      console.log(val);
      this.postArray=val ;
    });
  }

  onDelete(postImgPath:any,id:any){
    this.postService.deleteimage(postImgPath,id);
  }

  onFeatured(id:any, featured:boolean){
    const fearturedData ={
      isFeatured: featured
    }
    this.postService.markFeatured(id,fearturedData);
  }
}
