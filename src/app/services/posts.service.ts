import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor( private storage: AngularFireStorage,
     private afs: AngularFirestore,
     private toastr: ToastrService,
     private router: Router) {

   }

   uploadImage(selectedImage:any, postData:any, formStatus:any, id:any){
    const filePath = `postImg/${Date.now()}`;
    console.log(filePath);
    this.storage.upload(filePath,selectedImage).then(()=>{
      //console.log('Post image uploaded successfully');

      this.storage.ref(filePath).getDownloadURL().subscribe(URL=>{
        postData.postImgPath = URL;

        if(formStatus == 'Edit') {
          this.updateData(id,postData);
        } else {
          this.saveData(postData);
        }
        
        
      });
    });
   }

   saveData(postData:any){
    this.afs.collection('posts').add(postData).then(docRef=>{
      this.toastr.success('Data inserted successfully...');
      this.router.navigate(['/posts']);
    });
   }

   loadData() {
    return this.afs.collection('posts').snapshotChanges().pipe(
      map(
        actions => {
          return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return {id, data};
            }
          )
        }
      ))
  }

  loadOneData(id:any) {
    return this.afs.doc(`posts/${id}`).valueChanges();
  }

  updateData(id:any,postData:any){
    this.afs.doc(`posts/${id}`).update(postData).then(()=>{
      this.toastr.success('Data Updated Successfully...');
      this.router.navigate(['/posts']);
    });
  }

  deleteimage(postImgPath:any, id:any){
    this.storage.storage.refFromURL(postImgPath).delete().then(()=>{
    this.deleteData(id);
    });
  }

  deleteData(id:any){
    this.afs.doc(`posts/${id}`).delete().then(()=>{
      this.toastr.warning('Data Deleted...');
    });
  }

  markFeatured(id:any,fearturedData:any){
    this.afs.doc(`posts/${id}`).update(fearturedData).then(()=>{
      this.toastr.info('Feature Updated...');
    });
  }

}
