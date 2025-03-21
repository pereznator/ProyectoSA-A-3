import { Component, OnInit } from "@angular/core";
import { PedidoComponent } from "../../../shared/pedido/pedido.component";

@Component({
  selector: 'app-ver-orden',
  standalone: true,
  imports: [PedidoComponent],
  template: '<app-pedido></app-pedido>'
})
export class VerPedidoComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {
    
  }
}