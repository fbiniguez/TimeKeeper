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
    private aRoute: ActivatedRoute,
    private _auth: AuthService
    ) {
    this.crearEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      departamento: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      checkEmpleado: [],
      checkRepresentante: [],  
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id)
   }

  ngOnInit(): void {
    this.editarEmpleado();
    
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
      checkEmpleado: this.crearEmpleado.value.checkEmpleado,
      checkRepresentante: this.crearEmpleado.value.checkRepresentante, 
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
      checkEmpleado: this.crearEmpleado.value.checkEmpleado,
      checkRepresentante: this.crearEmpleado.value.checkRepresentante,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      uid: ''
    }
    this.spinner = true;
    await this._auth.registerUser(empleado.email, empleado.apellido1).then((user)=>{
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
editarEmpleado(){
  
  if(this.id !==null){
    this.titulo = 'Editar empleado';
    this.spinner = true;
    this._empleadoService.getUnEmpleado(this.id).subscribe(data=>{
      this.spinner = false;
      this.crearEmpleado.setValue({
        nombre: data.payload.data()['nombre'],
        apellido1: data.payload.data()['apellido1'],
        apellido2: data.payload.data()['apellido2'],
        departamento: data.payload.data()['departamento'],
        email: data.payload.data()['email'],
        password: data.payload.data()['password'],
        checkEmpleado: data.payload.data()['checkEmpleado'],
        checkRepresentante: data.payload.data()['checkRepresentante'],
       
      })
    })
  }
}
}
