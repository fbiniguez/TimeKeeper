import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreModule, DocumentData  } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  userUid: string = '';
  

  constructor(
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
    private router: Router
    ) { }

/*
async registrar(registro: any){
 
  //obtener el usuario activo
  let user = await firebase.auth().currentUser;
  registro.id = user.uid;
  console.log(registro);
  return registro;
}


 getCurrentUser(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      return user;
    } else {
      // No user is signed in.
    }
  });
  
  
   
}
*/

//funcion para obtener los registros desde firebase de un determinado empleado (id). Definitivo
getRegistros(id: string): Observable<any> {
  return this.firestore.collection('empleados').doc(id).collection('registros', ref =>ref.orderBy("Fecha_inicio", "desc")).snapshotChanges();
}

//funcion para eliminar un determinado registro que se pasa por parametro. Definitivo
eliminarRegistro(id: string): Promise<any>{
   let user = firebase.auth().currentUser;
   return this.firestore.collection('empleados').doc(user.uid).collection('registros').doc(id).delete();
  }

crearRegistro(registro: any): Promise<any> {

  return this.firestore.collection('empleados').doc(registro.uid).collection('registros').add(registro);
  //return this.firestore.collection('empleados').add(empleado);
  
}

actualizarRegistro(id: string, registro: any): Promise<any> {
  return this.firestore.collection('empleados').doc(registro.uid).collection('registros').doc(id).update(registro);
  
}
getUnRegistro(id: string, uid: string): Observable<any> {
  return this.firestore.collection('empleados').doc(uid).collection('registros').doc(id).snapshotChanges();
}
async readDoc(id: string){
  //Leer los datos de registros guardados funciona
  var firestore = firebase.firestore();
  var docref = firestore.collection('empleados').doc(id).collection('registros');
  var registros: any[] = [];
  return docref.onSnapshot((doc)=>{
    doc.forEach((datos)=>{
      //console.log(datos.data()['Fecha_inicio']);
      //console.log(datos.data());
      registros.push(datos.data())
      //return registros;
      //console.log(datos.data.toString());
    })
  })
  
  
}
async readDocument(id: string){
  //Leer los datos de registros guardados funciona
  var firestore = firebase.firestore();
  var docref = firestore.collection('empleados').doc(id).collection('registros');
  var registros: any[] = [];
  await docref.onSnapshot((doc)=>{
    doc.forEach((datos)=>{
      console.log(datos.data()['Fecha_inicio']);
      console.log(datos.data());
      registros.push(datos.data())
      return registros;
      //console.log(datos.data.toString());
    })
  })
  
  
}
recuperarRegistroUsuario(id: string){
  
  return this.firestore.collection('empleados').doc(id).collection('registros', ref => ref).snapshotChanges();
  //return this.firestore.collection('empleados', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  //return this.firestore.collection('empleados/').doc(id).collection('registros').snapshotChanges();
 // var registros = firebase.database().ref('empleados/' + id + '/registros');
  
 // registros.on('value', (snapshot) =>{  
 // const data = snapshot.val();
 // console.log('desde el servicio',data);
//});

}

}
