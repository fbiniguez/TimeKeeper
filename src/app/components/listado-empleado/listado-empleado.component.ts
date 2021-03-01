import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from 'angularfire2/auth';
import * as printJS from 'print-js';

@Component({
  selector: 'app-listado-empleado',
  templateUrl: './listado-empleado.component.html',
  styleUrls: ['./listado-empleado.component.css']
})
export class ListadoEmpleadoComponent implements OnInit {  
  constructor(
    private _registro: RegistroService,
    private _empleado: EmpleadoService,
    private toastr: ToastrService,
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private rutaActiva: ActivatedRoute
    ) {    
  }

  public registros: any[] = [];
  userEmail: string;
  logedUser: string;
  desiredUser: string;
  empleado: any;
  nombre: string;
  apellido: string;
  equal: boolean;
  isAdmin: boolean;
  isRepre: boolean;
  hayRegistros: boolean;

  //usuario= firebase.auth().currentUser;
  user = this.firebaseAuth.auth.onAuthStateChanged(user=>{
    if(user){
      this.userEmail = user.email;
      this.logedUser = user.uid;
      //console.log(user.uid)
    }
    
  })
  ngOnInit():void {
    //var usuario= firebase.auth().currentUser;
    


    this.getRegistros();
  }

 //Funcion que obtiene los datos de registros guardados para el empleado logueado.
  async leerRegistros(){

  let user = await firebase.auth().currentUser;
  let firestore = firebase.firestore();

  //Almacena la referencia a la estructura de las colecciones de datos
  let docref = firestore.collection('empleados').doc(user.uid).collection('registros');

  //Obtiene los registros de la base de datos y los ordena por fecha de inicio en orden descendente.
  return docref.orderBy("Fecha_inicio", "desc").onSnapshot((doc)=>{
    doc.forEach((datos)=>{
      this.registros.push(datos.data())
    })
  })
  }

  async getRegistros(){
    this.desiredUser=this.rutaActiva.snapshot.params.id;
    this.empleado = this.firebaseAuth.auth.onAuthStateChanged(user=>{
      if(user){
        this.userEmail = user.email;
        this.logedUser = user.uid;
        if(this.desiredUser == this.logedUser){this.equal = true}
      }
      
    })
    
    console.log('llegamos hasta aqui', this.logedUser);
    
    
    if(this.user && this.rutaActiva.snapshot.params.id!==undefined){
      this.desiredUser=this.rutaActiva.snapshot.params.id;
      //this.userEmail = user.email;
      //this.logedUser = user.uid;
      //this.desiredUser = user.uid;
      //console.log(user.uid, this.desiredUser);
      this.obtenerRegistrosEmpleado(this.logedUser); 
    }

    /*this.user = this.firebaseAuth.auth.onAuthStateChanged(user=>{
      if(this.user){
        this.userEmail = user.email;
        this.logedUser = user.uid;
        this.desiredUser = user.uid;
         }console.log(user.uid, this.desiredUser);    
   })
   */
    
    if(this.logedUser==this.desiredUser){
      this.obtenerRegistrosEmpleado(this.desiredUser);
      console.log('logedUser==this.desiredUser', this.logedUser, this.desiredUser);
    }else this.obtenerRegistrosEmpleado(this.desiredUser);
     console.log('logedUser==!this.desiredUser', this.logedUser, this.desiredUser);
 
  }

  eliminarRegistro(id: string){
    this._registro.eliminarRegistro(id).then(() =>{
      this.toastr.error('Registro eliminado con exito', 'Eliminar registro', {
        positionClass: 'toast-bottom-right'
      });
    }).catch(error =>{
      console.log(error);
    })
  }
  /*getEmpleado(){
    this.firestore.collection('empleados'.snapshotChanges().pipe(
      map(actions => empleado.map(a=>{
        const data = a.payload.doc.data();
        const.id = a.payload.doc.id;
        console.log(id, data);
        return {id, data};
      }))
    ))
  }
  */

   obtenerRegistrosEmpleado(uid: string){
    //if(this.rutaActiva.snapshot.params.id!==undefined){this.desiredUser=this.rutaActiva.snapshot.params.id;}
      //console.log(this.desiredUser, uid);
      this._empleado.getUnEmpleado(uid).subscribe((empleado)=>{
      if(empleado){
        this.nombre = empleado[0].nombre;
        this.apellido = empleado[0].apellido1; 
        this.isAdmin = empleado[0].checkAdmin;
        this.isRepre = empleado[0].checkRepresentante;
        console.log(empleado[0].nombre); 
        this.empleado=empleado;

      }
    })
    //this.desiredUser=this.rutaActiva.snapshot.params.id;
    this._registro.getRegistros(uid).subscribe(data => {
      this.registros = [];
        data.forEach((element: any) =>{
        this.registros.push({
          id: element.payload.doc.id,
           ...element.payload.doc.data()
        });
      });
    });
    if(this.registros.length >=0) {
      this.hayRegistros = true;
    }
  }
  printPdf(){
    const registros = JSON.stringify(this.registros);
    const printable = document.getElementById('print');
    printJS({
        printable: printable, 
        properties: ['Fecha entrada', 'Hora entrada', 'Fecha salida', 'Hora salida', 'H. ord.', 'H. extras', 'Observaciones'], 
        type: 'html',

      }) 
  }







  //async leeRegistros(){
    //let user = await firebase.auth().currentUser;
   // let uid = user.uid;
  //  console.log(uid);
   // await this._registro.recuperarRegistroUsuario(uid);//.subscribe(data=>{
      //data.forEach(element => {
  
        //console.log('forecah',data.payload.data());
     // });
      //console.log(data);
      //console.log('desde leeRegistrois: ', data.payload.data());
      
      //});

 // }

}
