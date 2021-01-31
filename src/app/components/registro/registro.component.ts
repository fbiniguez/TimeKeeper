import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import * as _moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { RegistroService } from 'src/app/services/registro.service';

const moment = _moment;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  crearRegistro: FormGroup;
  id: string | null;
  spinner = false;
  user = firebase.auth().currentUser;
  uid: string = this.user.uid; 
  currentTime: any;
  currentDate: any;
  registros: any[] = [];
  titulo = 'Nuevo registro horario';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private _registro: RegistroService,
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private _auth: AuthService
    ) {
      this.crearRegistro = this.fb.group({
        Fecha_inicio: ['', Validators.required],
        Hora_inicio: ['', Validators.required],
        Fecha_fin: [''],
        Hora_fin: [''],
        Horas_Ord: [''],
        Observaciones: [''],
        Horas_Ext: [''],
      })
      this.id = this.aRoute.snapshot.paramMap.get('id');
     
     }

  ngOnInit() {
    this.editarRegistro();
    this._auth.user$.subscribe(user =>{
      //asigna el usuario activo a la variable user      
    
        //this.uid = user.uid;
        console.log('UID desde el ngOninit: ',this.uid);
        if(user){this.uid = user.uid;}else this.uid = '';
      });
  }
  

  guardarEditarRegistro(){
    this.user = firebase.auth().currentUser;
    this.titulo = 'Nuevo registro horario';
    this.submitted = true;

    if(this.crearRegistro.invalid){
      return;
    }
    if(this.id === null){
      this.nuevoRegistro();
    }else{
      this.actualizarRegistro(this.id);
    }

    
  }


  async nuevoRegistro(){
    const registro: any = {
      Fecha_inicio: this.crearRegistro.value.Fecha_inicio,
      Hora_inicio: this.crearRegistro.value.Hora_inicio,
      Fecha_fin: this.crearRegistro.value.Fecha_fin,
      Hora_fin: this.crearRegistro.value.Hora_fin,
      Horas_Ord: this.crearRegistro.value.Horas_Ord,
      Horas_Ext: this.crearRegistro.value.Horas_Ext,
      Observaciones: this.crearRegistro.value.Observaciones,      
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      uid: ''
    }
    let user = await firebase.auth().currentUser;
    registro.uid = user.uid;
    this.spinner = true;
    await this._registro.crearRegistro(registro).then((data)=>{
      
      this.toastr.success('Creacion de nuevos registros','Nuevo registro creado con éxito',{
        positionClass:'toast-bottom-right'    
    });
      this.spinner = false;
      this.router.navigate(['listadoEmpleado']);
    }).catch(error =>{
      console.log('Ocurrio un error: ', error.code);
      console.log('Ocurrio un error: ', error.message);
    })
    this.crearRegistro.reset();
    this.submitted = false;
    this.spinner = false;
  }

  //funcion que envia los datos a traves del registro service para actualizarlos en firestore
  async actualizarRegistro(id: string){
    
    this.spinner = true;

    const registro: any = {
      Fecha_inicio: this.crearRegistro.value.Fecha_inicio,
      Hora_inicio: this.crearRegistro.value.Hora_inicio,
      Fecha_fin: this.crearRegistro.value.Fecha_fin,
      Hora_fin: this.crearRegistro.value.Hora_fin,
      Horas_Ord: this.crearRegistro.value.Horas_Ord,
      Horas_Ext: this.crearRegistro.value.Horas_Ext,
      Observaciones: this.crearRegistro.value.Observaciones,
      uid: this.uid,
      fechaActualizacion: new Date()
    }
    
    await this._registro.actualizarRegistro(id, registro).then(()=>{
      if(registro){
        this.spinner = false;
        this.toastr.info('El registrio fue modificado con éxito', 'Modificacion de registros',{
          positionClass: 'toast-bottom-right'
        })
        this.router.navigate(['/listadoEmpleado']);
      }else{
        console.log('ha ocurrido un error');
        return;
      }

    })
    
  }

  async editarRegistro(){
    let user = firebase.auth().currentUser.uid;
    if(this.id){
      this.titulo = 'Editar registro horario';
      this.spinner = true;
      await this._registro.getUnRegistro(this.id, user).subscribe(data=>{

            this.crearRegistro.setValue({
              Fecha_inicio: data.payload.data()['Fecha_inicio'],
              Hora_inicio: data.payload.data()['Hora_inicio'],
              Fecha_fin: data.payload.data()['Fecha_fin'],
              Hora_fin: data.payload.data()['Hora_fin'],
              Horas_Ord: data.payload.data()['Horas_Ord'],
              Horas_Ext: data.payload.data()['Horas_Ext'],
              Observaciones: data.payload.data()['Observaciones'] 
            })
          })
        } 
  }
 /* 
  //funcion para almacenar un registro
  async saveRegistry(){
    const registro = {
      uid: '',
      ...this.crearRegistro.value
    }
    console.log(this.crearRegistro.value);
    //await this._registro.registrar(this.registerForm.value, this.uid);
    let user = await firebase.auth().currentUser;
    registro.uid = user.uid;
    console.log(registro);
    this._registro.crearRegistro(registro).then(()=>{
      this.toastr.success('Registro añadido con exito', 'Añadir registros',{
        positionClass: 'toast-bottom-right'
      })
    //console.log('Registro creado con exito');
    //this._registro.readDoc(user.uid);
  });

  }
  */
  /*
  async readData(){
    let user = await firebase.auth().currentUser;
    console.log(user.uid);
    let result = this._registro.recuperarRegistroUsuario(user.uid).subscribe((data)=>{
      this.registros = [];
      data.forEach((element: any)=>{
        this.registros.push(element.payload.doc.data())
      });
    });
   console.log(this.registros)
  }
  async leerRegistros(){
    //Leer los datos de registros guardados funciona
  let user = await firebase.auth().currentUser;
  var firestore = firebase.firestore();
  var docref = firestore.collection('empleados').doc(user.uid).collection('registros');
  var registros: any[] = [];
  return docref.orderBy("Fecha_inicio", "asc").onSnapshot((doc)=>{
    doc.forEach((datos)=>{
      console.log(datos.data()['Fecha_inicio']);
      console.log(datos.data());
      registros.push(datos.data())
      //return registros;
      console.log(registros);
    })
  })
  }*/

  //funcion para recuperar un registrio de firestore
 /* async recuperaRegistroUsuario(){
    let user = await firebase.auth().currentUser;
    let uid = user.uid;
    console.log(uid);
    this._registro.recuperarRegistroUsuario(uid).subscribe(data=>{
      console.log('Desde el registro Component: ',data);
      this.registerForm.setValue({
        Fecha_inicio: data.payload.data()['Fecha_inicio'],
        Hora_inicio: data.payload.data()['Hora_inicio'],
        Fecha_fin: data.payload.data()['Fecha_fin'],
        Hora_fin: data.payload.data()['Hora_fin'],
        Horas_Ord: data.payload.data()['Horas_Ord'],
        Horas_Ext: data.payload.data()['Horas_Ext'],
        Observaciones: data.payload.data()['Observaciones']
      });

    })
  }*/
 

}

