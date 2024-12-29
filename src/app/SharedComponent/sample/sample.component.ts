import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LoaderService } from '../../Service/loader.service';
import { CommonModule, NgIf } from '@angular/common';
import { SampleViewComponent } from '../sample-view/sample-view.component';
import { EditToolComponent } from '../edit-tool/edit-tool.component';
import { PlayComponent } from '../play/play.component';

@Component({
  selector: 'app-sample',
  standalone: true,
  imports: [
    NgIf,
    SampleViewComponent,
    EditToolComponent,
    PlayComponent,
    CommonModule
  ],
  templateUrl: './sample.component.html',
  styleUrl: './sample.component.scss'
})
export class SampleComponent implements OnChanges{
  @Input() receivedData2!:File;
addedRegion:number=0;
addedRegion2:number=0;
recieve!:File|Blob;
croped!:boolean;
FileChangesAfterProcess!:Blob
  constructor(public loader:LoaderService){

  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  changed(i:number){
this.addedRegion=i;
this.addedRegion2=i;
  }
  changedAfterProcess(i:Blob){
    this.FileChangesAfterProcess=i;
  }
  received(i:File|Blob){
    this.recieve=i;

  }
  Croped(i:boolean){
this.croped=i;
  }
}
