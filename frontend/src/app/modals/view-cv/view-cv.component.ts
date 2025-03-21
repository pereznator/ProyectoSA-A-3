import { Component, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-cv',
  standalone: true,
  imports: [],
  templateUrl: './view-cv.component.html',
  styleUrl: './view-cv.component.scss'
})
export class ViewCvComponent {

  @Input() pdfLink: SafeResourceUrl;

  constructor(public modal: NgbActiveModal) {

  }
}
