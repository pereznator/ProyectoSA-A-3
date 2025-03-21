import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainService } from '../main.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

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

  constructor(
    private mainService: MainService,
    private router: Router,
    private authService: AuthService
  ) {}

  
  ngOnInit(): void {
    this.buscar();
  }


  buscar(): void {
    if (this.textoBuscar === "") {
      return;
    }
    this.loading = true;
    this.mainService.buscar(this.textoBuscar, this.selectedPriceSort, this.selectedFechaSort).pipe(take(1)).subscribe(resp => {
      this.productos = resp.response_database.result;
      console.log(this.productos);
      this.loading = false;
    }, err => {
      console.log(err);
    })
  }

  verProducto(idProducto: number): void {
    this.router.navigate(["productos", idProducto]);
  }

  onChangeFechaSort(): void {
    this.selectedFechaSort = this.selectedFechaSort === "ASC" ? "DESC" : "ASC";
    this.buscar();
  }
  onChangePrecioSort(): void {
    this.selectedPriceSort = this.selectedPriceSort === "ASC" ? "DESC" : "ASC";
    this.buscar();
  }
}
