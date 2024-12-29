import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalVariablesService } from '../../Service/global-variables.service';
import { SortDataComponent } from '../sort-data/sort-data.component';
import { AjustmentComponent } from '../ajustment/ajustment.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-current-data',
  standalone: true,
  imports: [
    SortDataComponent,
    AjustmentComponent,
    NgFor
  ],
  templateUrl: './current-data.component.html',
  styleUrls: ['./current-data.component.scss']  // Corrected to styleUrls
})
export class CurrentDataComponent  implements OnInit{
  selectedFiles: File[] = [];
  div1Height: number = 650 / 3;
  div2Height: number = 650 - this.div1Height;
  order: number = 1;
  lastSelected!: File;

  @Output() sendData = new EventEmitter<File>();
  @ViewChild('container2') containerRef: ElementRef | undefined;
  @ViewChild('resizeLine2') resizeLineRef: ElementRef | undefined;

  constructor(private sanitizer: DomSanitizer, private global: GlobalVariablesService) {}

  ngOnInit(): void {
    this.selectedFiles.sort((a, b) => a.name.localeCompare(b.name));
  }

  Order(i: number) {
    this.order = i;
    switch (this.order) {
      case 1:
        this.selectedFiles.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 2:
        this.selectedFiles.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 3:
        this.selectedFiles.sort((a, b) => a.size - b.size);
        break;
      case 4:
        this.selectedFiles.sort((a, b) => b.size - a.size);
        break;
      case 5:
        this.selectedFiles.sort((a, b) => a.lastModified - b.lastModified);
        break;
      case 6:
        this.selectedFiles.sort((a, b) => b.lastModified - a.lastModified);
        break;
    }
  }

  onchange(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      if (!this.selectedFiles.some(file => file.name === files[i].name)) {
        this.selectedFiles.splice(0, 0, files[i]);
      } else {
        alert(`${files[i].name} File already exists`);
      }
      this.Order(this.order);
    }
    if (!this.lastSelected) {
      this.lastSelected = this.selectedFiles[0];
      this.sendData.emit(this.lastSelected);
    }
  }

  delete(file: File) {
    const index = this.selectedFiles.findIndex(f => f === file);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
      if (this.lastSelected === file) {
        this.lastSelected = this.selectedFiles[index - 1] || this.selectedFiles[0];
        this.sendData.emit(this.lastSelected);
      }
    }
  }

  selectedCurrentFile(file: File) {
    if (this.lastSelected !== file) {
      this.sendData.emit(file);
      this.lastSelected = file;
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      const containerTop = this.containerRef?.nativeElement.offsetTop;
      const mouseY = event.clientY;
      const newDiv1Height = mouseY - 30;
      const newDiv2Height = 650 - newDiv1Height;

      this.div1Height = Math.min(newDiv1Height, 360);
      this.div2Height = Math.min(newDiv2Height, 450);
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }

  isResizing: boolean = false;

  startResize(event: MouseEvent) {
    this.isResizing = true;
  }
}
