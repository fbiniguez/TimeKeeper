import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.component.html',
  styleUrls: ['./crear-empleado.component.css']
})
export class CrearEmpleadoComponent implements OnInit {
  crearEmpleado: FormGroup;
  submitted = false;
  spinner = false;
  id: string | null;
  titulo = 'Nuevo Empleado';

  constructor(
    private fb:FormBuilder,
    private _empleadoService:EmpleadoService,
    private router: Router,
    private toastr: ToastrService,
    private rutaActiva: ActivatedRoute,
    private _auth: AuthService
    ) {
    this.crearEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      departamento: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      checkAdmin: [],
      checkRepresentante: [],  
      checkActivo: [] 
    })
    this.id = this.rutaActiva.snapshot.params.id;
    
    if(this.id === undefined){
      this.id = null;
    }
   }

  ngOnInit(): void {
    this.editarEmpleado();
    //this.guardarEditarEmpleado();
  }
  guardarEditarEmpleado(){
    this.titulo = 'Nuevo Empleado';
    this.submitted = true;
    if(this.crearEmpleado.invalid){
      return;
    }
    if(this.id === null){
      this.nuevoEmpleado();
      
    }else{
      this.actualizarEmpleado(this.id);
    }

    
  }

  actualizarEmpleado(id: string){
    this.spinner=true;
    const empleado: any = {
      nombre: this.crearEmpleado.value.nombre,
      apellido1: this.crearEmpleado.value.apellido1,
      apellido2: this.crearEmpleado.value.apellido2,
      departamento: this.crearEmpleado.value.departamento,
      email: this.crearEmpleado.value.email,
      password: this.crearEmpleado.value.password,
      checkAdmin: this.crearEmpleado.value.checkAdmin,
      checkRepresentante: this.crearEmpleado.value.checkRepresentante,
      checkActivo: this.crearEmpleado.value.checkActivo,
      fechaActualizacion: new Date()
    }

    this._empleadoService.updateEmpleado(id, empleado).then(()=>{
      this.spinner = false;
      this.toastr.info('El empleado fue modificado con éxito', 'Modificacion de empleados',{
        positionClass: 'toast-bottom-right'
      })
      this.router.navigate(['/listarEmpleados']);
    })
  }

 async nuevoEmpleado(){
    
    const empleado: any = {
      nombre: this.crearEmpleado.value.nombre,
      apellido1: this.crearEmpleado.value.apellido1,
      apellido2: this.crearEmpleado.value.apellido2,
      departamento: this.crearEmpleado.value.departamento,
      email: this.crearEmpleado.value.email,
      password: this.crearEmpleado.value.password,
      checkAdmin: this.crearEmpleado.value.checkAdmin,
      checkRepresentante: this.crearEmpleado.value.checkRepresentante,
      checkActivo: this.crearEmpleado.value.checkActivo,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      uid: ''
    }
    this.spinner = true;
    await this._auth.registerUser(empleado.email, empleado.password).then((user)=>{
      console.log('nuevo usuario', user);
      if(user){
        console.log('usuario devuelto por auth',user);
        console.log('uid', user.user.uid)
        empleado.uid = user.user.uid; 
        this._empleadoService.crearEmpleado(empleado).then(()=>{
          this.toastr.success('Creacion de nuevos empleados','Nuevo empleado creado con éxito',{
            positionClass:'toast-bottom-right'
          });
          console.log(empleado.email);
          this.spinner = false;
          this.router.navigate(['/listarEmpleados']);
        }).catch(error =>{
          console.log(error);
        })
        this.crearEmpleado.reset();
        this.submitted = false;
        this.spinner = false;

      }

    }).catch(error =>{
      console.log('Ocurrio un error: ', error.code);
      console.log('Ocurrio un error: ', error.message);
    })
   /*
    this._empleadoService.crearEmpleado(empleado).then(()=>{
      this.toastr.success('Creacion de nuevos empleados','Nuevo empleado creado con éxito',{
        positionClass:'toast-bottom-right'
      });
      console.log(empleado.email);
      firebase.auth().createUserWithEmailAndPassword(empleado.email, empleado.departamento).catch(err=>{
        console.log('Ocurrio un error: ', err.code);
        console.log('Ocurrio un error: ', err.message);
      })
      this.spinner = false;
      this.router.navigate(['/listarEmpleados']);
    }).catch(error =>{
      console.log(error);
    })
    this.crearEmpleado.reset();
    this.submitted = false;
    this.spinner = false;
    */
  }
async editarEmpleado(){
  
  if(this.id !==null){
    this.titulo = 'Editar empleado';
    this.spinner = true;
    await this._empleadoService.returnEmpleadoData(this.id).subscribe(data=>{
      this.spinner = false;
      this.crearEmpleado.setValue({
        nombre: data.payload.data()['nombre'],
        apellido1: data.payload.data()['apellido1'],
        apellido2: data.payload.data()['apellido2'],
        departamento: data.payload.data()['departamento'],
        email: data.payload.data()['email'],
        password: data.payload.data()['password'],
        checkAdmin: data.payload.data()['checkAdmin'],
        checkRepresentante: data.payload.data()['checkRepresentante'],
        checkActivo: data.payload.data()['checkActivo'],
       
      })
    })
  }
}
}
