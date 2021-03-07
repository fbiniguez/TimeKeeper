import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
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

  
  user = this.firebaseAuth.auth.onAuthStateChanged(user=>{
    if(user){
      this.userEmail = user.email;
      this.logedUser = user.uid;
    }
    
  })
  ngOnInit():void {
    //al cargarse la vista llama a la funcion para obterner los registros del usuario
    this.getRegistros();
  }

  //funcion recuperar los registros de un usuario
  async getRegistros(){
    //almacenado del id del usuario desde la ruta
    this.desiredUser=this.rutaActiva.snapshot.params.id;
    this.empleado = this.firebaseAuth.auth.onAuthStateChanged(user=>{
      if(user){
        this.userEmail = user.email;
        this.logedUser = user.uid;
        if(this.desiredUser == this.logedUser){this.equal = true}
      }
      
    })
    //si hay un usuario logeado pero 
    if(this.user && this.rutaActiva.snapshot.params.id!==undefined){
      this.desiredUser=this.rutaActiva.snapshot.params.id;
      //obtener los datos del usuario activo
     this.obtenerRegistrosEmpleado(this.logedUser); 
    }else this.obtenerRegistrosEmpleado(this.desiredUser);
  }

  eliminarRegistro(id: string){
    //llamada al servicio para eliminar el registro
    this._registro.eliminarRegistro(id).then(() =>{
      //mensaje de borrado con exito
      this.toastr.success('Registro eliminado con exito', 'Eliminar registro', {
        positionClass: 'toast-bottom-right'
      });
    }).catch(error =>{
      //mensaje de aviso error en borrado
      this.toastr.error('Fallo en la eliminacion del registro', 'Eliminar registro', {
        positionClass: 'toast-bottom-right'
      });
    })
  }

   obtenerRegistrosEmpleado(uid: string){
      //obtencion de los datos del empleado
      this._empleado.getUnEmpleado(uid).subscribe((empleado)=>{
      if(empleado){
        this.nombre = empleado[0].nombre;
        this.apellido = empleado[0].apellido1; 
        this.isAdmin = empleado[0].checkAdmin;
        this.isRepre = empleado[0].checkRepresentante;
        this.empleado=empleado;
      }
    })
    //obtencion de los registros del empleado
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
  //Funcion impresion de registros a pdf
  printPdf(){
    //obtiene los objetos del DOM a imprimir
    const printable = document.getElementById('print');
    const cabecera = document.getElementById('cabecera');
    //funcion imprimir
    printJS({
        printable: printable, 
        properties: ['Fecha entrada', 'Hora entrada', 'Fecha salida', 'Hora salida', 'H. ord.', 'H. extras', 'Observaciones'], 
        type: 'html',
        header: cabecera.innerHTML,
        gridStyle: 'border: 2px solid #3971A5;'
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
