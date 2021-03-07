import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrearEmpleadoComponent } from './components/crear-empleado/crear-empleado.component';
import { ListadoEmpleadoComponent } from './components/listado-empleado/listado-empleado.component';
import { ListarEmpleadosComponent } from './components/listar-empleados/listar-empleados.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';


const routes: Routes = [
  {path :'', redirectTo:'login', pathMatch: 'full'},
  {path : 'listadoEmpleado', component: ListadoEmpleadoComponent},
  {path : 'listadoEmpleado/:id', component: ListadoEmpleadoComponent},
  {path : 'login', component: LoginComponent},
  {path : 'crearEmpleado', component: CrearEmpleadoComponent},
  {path : 'editarEmpleado/:id', component: CrearEmpleadoComponent},
  {path : 'registro', component: RegistroComponent},
  {path : 'editarRegistro/:id', component: RegistroComponent},
  {path : 'listarEmpleados', component: ListarEmpleadosComponent},
  {path :'**', redirectTo:'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
