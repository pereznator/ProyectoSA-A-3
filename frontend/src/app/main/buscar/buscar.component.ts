import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainService } from '../main.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../../admin/admin.service';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, NgbModule, LoadingComponent, CurrencyPipe, DatePipe],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.scss'
})
export class BuscarComponent implements OnInit {
  
  selectedPriceSort = "ASC";
  selectedFechaSort = "ASC";

  textoBuscar: string = "";
  productos: any[] = [];
  loading: boolean = false;

  categorias: string[] = [];
  marcas: string[] = [];
  selectedCategoria: string = '';
  selectedMarca: string = '';
  minPrecio: number | null = null;
  maxPrecio: number | null = null;
  selectedRating: number | null = null;

  todosLosProductos: any[] = []; // Para mantener todos los productos

  constructor(
    private mainService: MainService,
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  
  ngOnInit(): void {
    this.getProductos();
  }


  getProductos(): void {
    this.loading = true;
    this.adminService.obtenerProductos().pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.todosLosProductos = resp.productos;
      this.categorias = [...new Set(resp.productos.map(p => p.category))] as string[];
      this.marcas = [...new Set(resp.productos.flatMap(p => p.brands))] as string[];
      this.filtrarYOrdenar(); // aplicar filtros inicialmente
      this.loading = false;
    }, err => {
      console.log(err);
    });
  }

  filtrarYOrdenar(): void {
    let filtrados = [...this.todosLosProductos];
  
    // Filtro por texto
    if (this.textoBuscar.trim()) {
      const texto = this.textoBuscar.toLowerCase();
      filtrados = filtrados.filter(p => p.name.toLowerCase().includes(texto));
    }
  
    // Filtro por categoría
    if (this.selectedCategoria) {
      filtrados = filtrados.filter(p => p.category === this.selectedCategoria);
    }
  
    // Filtro por marca
    if (this.selectedMarca) {
      filtrados = filtrados.filter(p => p.brands.includes(this.selectedMarca));
    }
  
    // Filtro por rango de precio
    if (this.minPrecio !== null) {
      filtrados = filtrados.filter(p => p.price >= this.minPrecio);
    }
    if (this.maxPrecio !== null) {
      filtrados = filtrados.filter(p => p.price <= this.maxPrecio);
    }
  
    // Filtro por calificación
    if (this.selectedRating !== null) {
      filtrados = filtrados.filter(p => p.rating !== null && p.rating >= this.selectedRating);
    }
  
    // Ordenamiento por precio
    filtrados.sort((a, b) => {
      return this.selectedPriceSort === 'ASC' ? a.price - b.price : b.price - a.price;
    });
  
    this.productos = filtrados;
  }

  verProducto(idProducto: number): void {
    this.router.navigate(["productos", idProducto]);
  }
}
