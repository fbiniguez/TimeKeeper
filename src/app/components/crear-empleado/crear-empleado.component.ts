import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadoService } from 'src/app/services/empleado.service';


@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.component.html',
  styleUrls: ['./crear-empleado.component.css'],
  
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
    private _auth: AuthService,
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
  }

  guardarEditarEmpleado(){
    this.titulo = 'Nuevo Empleado';
    this.submitted = true;
    //chequea validez formulario
    if(this.crearEmpleado.invalid){
      return;
    }
    //si no hay id de empleado, nuevo empleado
    if(this.id === null){
      this.nuevoEmpleado();
     //si lo hay, editar empleado 
    }else{
      this.titulo = 'Editar Empleado';
      this.actualizarEmpleado(this.id);
    }

    
  }

  async actualizarEmpleado(id: string){
    this.spinner=true;
    //contructor objeto empleado
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
    try {
      //llamada a la funcion para actualizar datos empleado
      await this._empleadoService.updateEmpleado(id, empleado).then(()=>{
        this.spinner = false;
        //mensaje de exito tras actualizar
        this.toastr.info('El empleado fue modificado con éxito', 'Modificacion de empleados',{
          positionClass: 'toast-bottom-right'
        })
        this.router.navigate(['/listarEmpleados']);
      })
      //mensaje en caso de producirse un error
    } catch (error) {
      this.toastr.error('Error en la operacion de modificación del empleado', 'Modificacion de empleados',{
        positionClass: 'toast-bottom-right'
      })
    }

  }

 async nuevoEmpleado(){
    //constructor objeto empleado
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
    
    try {
      this.spinner = true;
      //llamada al servicio auth para crear nuevo usuario
      await this._auth.registerUser(empleado.email, empleado.password).then((user)=>{  
        //si la creacion del nuevo usuario en el servicio de autentificacion es exitosa muestra mensaje 
        //Se almacena el nuevo usuario en la base de datos con el servicio empleadoService
      if(user){
        empleado.uid = user.user.uid; 
        this._empleadoService.crearEmpleado(empleado).then(()=>{
          this.toastr.success('Creacion de nuevos empleados','Nuevo empleado creado con éxito',{
            positionClass:'toast-bottom-right'
          });
          //navegar vista empleados
          this.router.navigate(['/listarEmpleados']);
        }).catch(error =>{
          //mensaje error si no se almacenan correctamente los datos del usuario
          this.toastr.error('Creacion de nuevos empleados','Error de guardado del nuevo usuario',{
            positionClass:'toast-bottom-right'
             })
          })
         }
      })
    } catch (error) {
      //mensaje error si no se crea corerctamente el usuario
      this.toastr.error('Creacion de nuevos empleados','Error en la creacion del nuevo usuario',{
        positionClass:'toast-bottom-right'
        })
    }
        //limpiar formulario
        this.crearEmpleado.reset();
        this.submitted = false;
        this.spinner = false;
  }
  
  
editarEmpleado(){
  //Comprobacion de que se esta pasando un id de empleado
  if(this.id !==null){
    this.titulo = 'Editar empleado';
    this.spinner = true;
    //llamada a la funcion que recupera los datos almacenados
    this._empleadoService.returnEmpleadoData(this.id).subscribe(data=>{
      this.spinner = false;
      //muestra los datos recuperados en el formulario
      this.crearEmpleado.setValue({
        nombre: data.payload.data()['nombre'],
        apellido1: data.payload.data()['apellido1'],
        apellido2: data.payload.data()['apellido2'],
        departamento: data.payload.data()['departamento'],
        email: data.payload.data()['email'],
        password: data.payload.data()['password'],
        checkAdmin: data.payload.data()['checkAdmin'],
        checkRepresentante: data.payload.data()['checkRepresentante'],
        checkActivo: data.payload.data()['checkActivo']       
          })
      })
    }
  }
}
