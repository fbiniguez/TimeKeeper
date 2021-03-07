import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';



//Modulos
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ToastrModule } from 'ngx-toastr';

//Componentes
import { AppComponent } from './app.component';
import { ListadoEmpleadoComponent } from './components/listado-empleado/listado-empleado.component';
import { CrearEmpleadoComponent } from './components/crear-empleado/crear-empleado.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { environment } from 'src/environments/environment';
import { ListarEmpleadosComponent } from './components/listar-empleados/listar-empleados.component';





@NgModule({
  declarations: [
    AppComponent,
    ListadoEmpleadoComponent,
    CrearEmpleadoComponent,
    NavbarComponent,
    LoginComponent,
    RegistroComponent,
    ListarEmpleadosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    MatMomentDateModule,
    MatDatepickerModule,
    FormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()    
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
