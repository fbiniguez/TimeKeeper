import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {
  private cliente: {
    id: Number;
    nombre: String;
    apellido: String;
    createAt: String;
    email: String;
  }
  private titulo:string = "crear Cliente";
  constructor() { }

  ngOnInit() {
  }
public create():void{
  console.log("clicked");
  console.log(this.cliente);
}
}
