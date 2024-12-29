import { Component, ElementRef, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { GlobalVariablesService } from '../../Service/global-variables.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { CurrentDataComponent } from '../current-data/current-data.component';
import { SampleComponent } from '../sample/sample.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    CurrentDataComponent,
    SampleComponent,
    HttpClientModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  div1Width: number = window.innerWidth / 3 + 25;
  div2Width: number = window.innerWidth;
  @ViewChild('container') containerRef: ElementRef | undefined;
  @ViewChild('resizeLine') resizeLineRef: ElementRef | undefined;
  file!: File;
  emailGoogle: string | null = '';

  constructor(public global: GlobalVariablesService,
              @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.emailGoogle = localStorage.getItem('googleLogin') || '';
    console.log(this.emailGoogle);
    this.global.sampleViewWidth = this.div2Width;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      const containerLeft = this.containerRef?.nativeElement.offsetLeft;
      const mouseX = event.clientX;
      const newDiv1Width = mouseX - containerLeft;
      const newDiv2Width = window.innerWidth - newDiv1Width;
      this.global.sampleViewWidth = newDiv2Width;
      this.div1Width = Math.min(newDiv1Width, window.innerWidth);
      this.div2Width = Math.min(newDiv2Width, window.innerWidth);
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

  Selected(file: File) {
    this.file = file;
  }
}
