import { CurrencyPipe, DatePipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../client/client.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, LoadingComponent, CurrencyPipe, DatePipe, NgbModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PedidoComponent implements OnInit {
  
  loading: boolean = false;
  productos: any[] = [];
  pedido: any;
  total = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.getOrden();
  }
  
  getOrden(): void {
    this.loading = true;
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      this.clientService.obtenerPedidoPorId(params["id"]).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.pedido = resp.pedido;
        let total = 0;
        this.pedido.detalles.map(prod => {
          total += (prod.cantidad * prod.precio);
        });
        this.total = total;
        this.loading = false;
      }, err => {
        console.log(err);
      });
    });  
  }

  atras(): void {
    this.location.back();
  }
}
