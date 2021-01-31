import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listado-empleado',
  templateUrl: './listado-empleado.component.html',
  styleUrls: ['./listado-empleado.component.css']
})
export class ListadoEmpleadoComponent implements OnInit {  
  constructor(
    private _registro: RegistroService,
    private toastr: ToastrService,
    private router: Router
    ) {    
  }

  public registros: any[] = [];

  ngOnInit():void {
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

  getRegistros(){
    
    let user = firebase.auth().currentUser;
    if(user==null){
      this.router.navigate(['/login']);
      return;
    } 
    this._registro.getRegistros(user.uid).subscribe(data => {
      this.registros = [];
        data.forEach((element: any) =>{
        this.registros.push({
          id: element.payload.doc.id,
           ...element.payload.doc.data()
        });
      });
    });
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
