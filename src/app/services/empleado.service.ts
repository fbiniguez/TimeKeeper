import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreModule  } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  userData: Observable<firebase.User>;
  constructor(
    private firestore: AngularFirestore, 
    private angularFireAuth: AngularFireAuth
    ) {
      this.userData = angularFireAuth.authState;
      
     }

  getEmpleados(): Observable<any> {
    return this.firestore.collection('empleados', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }
  crearEmpleado(empleado: any): Promise<any> {
    return this.firestore.collection('empleados').add(empleado); 
  }

  updateEmpleado(id: string, empleado: any): Promise<any> {
    return this.firestore.collection('empleados').doc(id).update(empleado);
  }

  eliminarEmpleado(id: string): Promise<any> {
    console.log('borrando empleado: ', id)
    return this.firestore.collection('empleados').doc(id).delete();
  }

  getUnEmpleado(id: string): Observable<any> {
    //return this.firestore.collection('empleados').doc().collection.doc(id)
    console.log('id desde empleado service',id);
    if(id){
      return this.firestore.collection('empleados', ref => ref.where('uid', '==', id)).valueChanges();
    }
    

    //return this.firestore.collection('empleados').doc(id).snapshotChanges();
    //return this.firestore.collection('empleados', ref => ref.where(doc(id)==id)).snapshotChanges();
  }
  returnEmpleadoData(id: string): Observable<any>{
    return this.firestore.collection('empleados').doc(id).snapshotChanges();
  }
  
  signIn (email: string, password: string) {
    this.angularFireAuth.auth.signInWithEmailAndPassword(email, password).then(res=>{
      console.log('Estas dentro de la app');
    }).catch(err=>{
      console.log('Ocurrio un error:', err.message);
    });
  }
  signOut(){
    this.angularFireAuth.auth.signOut();
  }

}
