import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { RegistroService } from 'src/app/services/registro.service';


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
  uid: string; 
  registros: any[] = [];
  titulo = 'Nuevo registro horario';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private _registro: RegistroService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,

    ) {
      //instancia de formulario
      this.crearRegistro = this.fb.group({
        Fecha_inicio: ['', Validators.required],
        Hora_inicio: ['', Validators.required],
        Fecha_fin: [''],
        Hora_fin: [''],
        Horas_Ord: [''],
        Observaciones: [''],
        Horas_Ext: [''],
      })
      //almacenamos el identificador de registro
      this.id = this.aRoute.snapshot.paramMap.get('id');
     
     }

  ngOnInit() {
    this.editarRegistro();
  }
  

  guardarEditarRegistro(){
    //almacenado datos usuario actual
    this.user = firebase.auth().currentUser;
    this.uid = firebase.auth().currentUser.uid;
    this.titulo = 'Nuevo registro horario';
    this.submitted = true;
    //detener si el formulario no es valido
    if(this.crearRegistro.invalid){
      return;
    }
    //si no hay id de registro, llamar a nuevo registro, si no, actualizar registro
    if(this.id === null){
      this.nuevoRegistro();
    }else{
      this.titulo = 'Editar registro horario';
      this.actualizarRegistro(this.id);
    }    
  }


  async nuevoRegistro(){
    //constructor de objeto registro
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
    //añadir identificador de usuario a registro
    let user = firebase.auth().currentUser;
    registro.uid = user.uid;
    this.spinner = true;
    //enviar objeto registro a servicio para almacenamiento
    await this._registro.crearRegistro(registro).then((data)=>{
      if(data){
      // mensaje de aviso si el guardado es exitoso
      this.toastr.success('Creacion de nuevos registros','Nuevo registro creado con éxito',{
        positionClass:'toast-bottom-right'    
          });
        }
      this.spinner = false;
      //redireccion a la vista de lista de registros del empleado
      this.router.navigate(['/listadoEmpleado', registro.uid]);
    }).catch(error =>{
      this.toastr.error('Creacion de nuevos registros',error.message,{
        positionClass:'toast-bottom-right'    
          });
    })
    //limpieza de formulario
    this.crearRegistro.reset();
    this.submitted = false;
    this.spinner = false;
  }

  //funcion que envia los datos a traves del registro service para actualizarlos en firestore
  async actualizarRegistro(id: string){
    
    this.spinner = true;
    //constructor objeto registro
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
    //llamada al servicio para guardar los datos actualizados
    await this._registro.actualizarRegistro(id, registro).then(()=>{
      //si la actualizacion es correcta muestra mensaje y redirige a listadoEmpleado
      if(registro){
        this.spinner = false;
        this.toastr.success('El registro fue modificado con éxito', 'Modificacion de registros',{
          positionClass: 'toast-bottom-right'
        })
        this.router.navigate(['/listadoEmpleado', registro.uid]);
      }else{
        this.toastr.error('Error en la modificacion del registro', 'Creacion de nuevos registros',{
          positionClass:'toast-bottom-right'    
            });
        return;
      }

    })
    
  }

 editarRegistro(){
    //almacenado del identificador de usuario
    this.uid = firebase.auth().currentUser.uid;
    //si existe un identificador se recuperan datos
    if(this.id){
      this.titulo = 'Editar registro horario';
      this.spinner = true;
      //obtener los datos del registro
      this._registro.getUnRegistro(this.id, this.uid).subscribe(data=>{
            //rellenar formulario de registro con valores almacenados
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
          this.spinner = false;
        } 
  }
 
}

