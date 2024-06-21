import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  

  constructor(private afs: AngularFirestore, private toastr: ToastrService) { }

  saveData(categoryData: any) {
    this.afs.collection('categories').add(categoryData).then(docRef => {
      console.log(docRef);
      this.toastr.success('Data Insert Successfully');
    }).catch(err => {
      console.log(err);
    });
  }

  loadData() {
    return this.afs.collection('categories').snapshotChanges().pipe(
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

  updateData(id:any,editedData:any): boolean {
    
    console.log(id,editedData);
    this.afs.doc(`categories/`+id).update(editedData).then(
      docref=>{
        this.toastr.success('Data Updated Successfully');
        return true;
      }
    ).catch(err=>{
      this.toastr.success('Data Updation Error..!');
      return false;
    });
    return false;
  }
  
  deleteData(id:any) {
    this.afs.collection('categories').doc(id).delete().then(docref=>{
      this.toastr.success('Data Deleted Successfully');
    })
  }
}
