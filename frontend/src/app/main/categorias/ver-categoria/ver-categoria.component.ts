import { Component, OnInit } from '@angular/core';
import { MainService } from '../../main.service';
import { AuthService } from '../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DatePipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { User } from '../../../auth/auth.types';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-ver-categoria',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgbModule, LoadingComponent, CurrencyPipe, DatePipe],
  templateUrl: './ver-categoria.component.html',
  styleUrl: './ver-categoria.component.scss'
})
export class VerCategoriaComponent implements OnInit {
  
  loading: boolean = false;
  productos: any[] = [];

  selectedNameSort = "ASC";
  selectedPriceSort = "ASC";
  selectedFechaSort = "ASC";

  categoriaId: string;
  categoria: string;

  user: User;
  constructor(
    private mainService: MainService,
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      this.categoriaId = params["idCategoria"];
      this.getCategoria();
    });
  }

  getCategoria(): void {
    this.loading = true;
    this.mainService.obtenerCategoriaPorId(this.categoriaId).pipe(take(1), map(resp => resp.response_database.result[0])).subscribe(resp => {
      console.log(resp);
      this.categoria = resp.descripcion;
      this.getProductos();
    }, err => {
      console.log(err);
    });
  }

  getProductos(): void {
    this.loading = true;
    console.log(this.selectedNameSort);
    
    this.mainService.obtenerProductosPorCategoria(this.categoriaId, this.selectedPriceSort, this.selectedFechaSort, this.selectedNameSort).pipe(take(1), map(resp => resp.response_database.result)).subscribe(resp => {
      console.log(resp);
      this.productos = resp;
      this.loading = false;
    }, err => {
      this.loading = false;
      console.log(err);
    });
    
  }

  onChangeNombreSort(): void {
    this.selectedNameSort = this.selectedNameSort === "ASC" ? "DESC" : "ASC";
    this.getProductos();
  }
  onChangeFechaSort(): void {
    this.selectedFechaSort = this.selectedFechaSort === "ASC" ? "DESC" : "ASC";
    this.getProductos();
  }
  onChangePrecioSort(): void {
    this.selectedPriceSort = this.selectedPriceSort === "ASC" ? "DESC" : "ASC";
    this.getProductos();
  }

  verProducto(idProducto: number): void {
    this.router.navigate(["productos", idProducto])
  }

  atras(): void {
    this.location.back();
  }
}
