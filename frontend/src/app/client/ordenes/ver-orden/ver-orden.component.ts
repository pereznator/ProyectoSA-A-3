import { Component, OnInit } from '@angular/core';
import { PedidoComponent } from '../../../shared/pedido/pedido.component';

@Component({
  selector: 'app-ver-orden',
  standalone: true,
  imports: [PedidoComponent],
  templateUrl: './ver-orden.component.html',
  styleUrl: './ver-orden.component.scss'
})
export class VerOrdenComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {
    
  }
}
