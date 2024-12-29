import { NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sort-data',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './sort-data.component.html',
  styleUrl: './sort-data.component.scss'
})
export class SortDataComponent {
  open:boolean=false;
  active:number=1;
  selectedElement:string='';



  selectedSvg:number=1;

  @ViewChild('element1') element1: ElementRef | undefined;
  @ViewChild('parent') parent: ElementRef | undefined;

  @Output() sendData:EventEmitter<number>;


    constructor() {


    this.sendData=new EventEmitter<number>();
   }
  ngOnInit(): void {
  }

   selectedSVG(i:number){
    this.selectedSvg=i;
    this.sendData.emit(this.selectedSvg);

   }
  ngOnChanges(changes: SimpleChanges): void {

  }



      @HostListener('document:click', ['$event'])
      onclick(event: MouseEvent) {
        if(this.element1?.nativeElement === event.target)
        {
         this.open=!this.open;

        }
        else if(this.parent?.nativeElement !== event.target){
        this.open=false;

        }
        }


}
