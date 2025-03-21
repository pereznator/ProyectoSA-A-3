import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Router, RouterLink } from '@angular/router';
import { map, take } from 'rxjs';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, LoadingComponent, DatePipe, CurrencyPipe, NgbModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  
  loadingOfertas = false;
  loadingValoraciones = false;
  loadingVendidos = false;

  ofertas: any[] = [];
  productosValorados: any[] = [];
  productosVendidos: any[] = [];


  constructor(
    private mainService: MainService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.getOfertas();
    this.getTop10Vendidos();
    this.getTop10Valorados();
  }

  getOfertas(): void {
    this.loadingOfertas = true;
    this.mainService.obtenerOfertas({ estado_oferta_id: 1 }).pipe(take(1), map(resp => resp.response_database.result)).subscribe(resp => {
      console.log(resp);
      this.ofertas = resp;
      this.loadingOfertas = false;
    }, err => {
      console.log("ERROR OFERTAS",err);
    });
  }

  getTop10Vendidos(): void {
    this.loadingVendidos = true;
    this.mainService.obtenerTop10Vendidos().pipe(take(1), map(resp => resp.response_database.result)).subscribe(resp => {
      console.log(resp);
      this.productosVendidos = resp;
      this.loadingVendidos = false;
    }, err => {
      console.log(err);
    });
  }

  getTop10Valorados(): void {
    this.loadingValoraciones = true;
    this.mainService.obtenerTop10Valorados().pipe(take(1), map(resp => resp.response_database.result)).subscribe(resp => {
      console.log(resp);
      this.productosValorados = resp;
      this.loadingValoraciones = false;
    }, err => {
      console.log(err);
    });
  }

  verProducto(idProducto: number): void {
    this.router.navigate(["productos", idProducto]);
  }
}
