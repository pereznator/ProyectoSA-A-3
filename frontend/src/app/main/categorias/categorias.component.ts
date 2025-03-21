import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { MainService } from '../main.service';
import { take } from 'rxjs';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/auth.types';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { CrearCategoriaComponent } from '../../modals/crear-categoria/crear-categoria.component';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, LoadingComponent, NgbModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {
  
  categorias: any[];
  loading: boolean = false;
  user: User;

  constructor(
    private adminService: AdminService,
    private mainService: MainService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getUser();
    this.getCategorias();
  }

  getUser(): void {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      console.log(user);
      this.user = user;
    }, err => {
      console.log(err);
    });
  }

  getCategorias(): void {
    this.loading = true;
    this.mainService.obtenerCategorias().pipe(take(1)).subscribe(resp => {
      this.categorias = resp.response_database.result;
      this.loading = false;
    }, err => {
      this.loading = false;
      console.log(err);
    });
  }

  crearCategoria(): void {
    const modal = this.modalService.open(CrearCategoriaComponent);
    modal.result.then(descripcion => {
      this.adminService.crearCategoria({descripcion}).pipe(take(1)).subscribe(resp => {
        this.getCategorias();
      }, err => {
        console.log(err);
      });
      console.log(descripcion);
    }, dismiss => {});
  }

  eliminarCategoria(idCategoria: number): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Eliminar Categoría";
    modal.componentInstance.descripcion = "Estas seguro que deseas eliminar esta categoría?";
    modal.result.then(result => {
      
    }, dismiss => {});
  }

  verCategoria(idCategoria: number): void {
    this.router.navigate(["categorias", idCategoria]);
  }
}
