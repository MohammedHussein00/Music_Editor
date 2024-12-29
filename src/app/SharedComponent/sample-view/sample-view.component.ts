import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import { GlobalVariablesService } from '../../Service/global-variables.service';
import { LoaderService } from '../../Service/loader.service';
import { WaveService } from '../../Service/wave.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sample-view',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './sample-view.component.html',
  styleUrl: './sample-view.component.scss'
})
export class SampleViewComponent implements OnChanges,OnInit{
  @Input() receivedData!: File;
  @Input() receivedData2!: File|Blob;
  @Input() Croped!: boolean;
  @Output() RegionChanged!: EventEmitter<number>;
  @Output() FileChangesAfterProcess!: EventEmitter<Blob>;

   currentscroll: number=0;
  CurrentFile!: File|Blob;
  waveformWidth:number=0
startWith:number=0
currentWidth:number=0;
changeOnSize:number=0;
startRegion:number=0

  @ViewChild('con') containerRef: ElementRef | undefined;
  div1Width: number = 0;
  start:number=0
  containerLeft:number=0
  @ViewChild('resizeLine2') resizeLineRef: ElementRef | undefined;

   duration:number =0


  constructor(private wave:WaveService,private global:GlobalVariablesService,public loader:LoaderService){
    this.RegionChanged=new EventEmitter<number>();
    this.FileChangesAfterProcess=new EventEmitter<Blob>();

  }
  ngOnInit(): void {
    let waveform = document.getElementById('waveform');
    waveform!.style.width='10000px';
    this.waveformWidth=10000;
console.log(waveform?.style.width)

  }
  ngOnChanges(changes: SimpleChanges): void {







    this.CurrentFile = this.receivedData;


if(this.global.croped){
   this.CurrentFile=this.receivedData2;
   this.global.FileChanges=this.receivedData2;


this.Croped=false;
}
else{
  this.global.FileChanges=this.receivedData;
}
this.global.croped=false;


    const parentElement = document.getElementById('parent');
    var audio = document.getElementById('audio') as HTMLAudioElement;

    this.wave.Init(this.CurrentFile, '#waveform',audio);
    if(this.wave.wavesurfer)
    this.wave.wavesurfer.on('loading',(percent)=>{
      this.loader.isLoading.next(true);
      this.loader.percent=percent;
    })
   this.wave.wavesurfer.on('audioprocess', () => {
    this.duration= this.wave.wavesurfer.getDuration();
    const currentTime = this.wave.wavesurfer.getCurrentTime();

    const waveform = document.getElementById('waveform');



     if(parentElement){
      const scrollLeft = (this.waveformWidth / this.duration) * currentTime - 500;
    parentElement.scrollLeft = scrollLeft;
     }


  });
  this.wave.wavesurfer.on('ready', () => {
    this.loader.isLoading.next(false);


  });
  this.wave.wavesurfer.on('seeking', (position: number) => {
    if(this.wave.audio.onplay)
    this.wave.audio.currentTime=position;
  });


  /////////////////////////////////


  this.wave.wavesurfer.setOptions({
    barWidth:2,
    plugins: [
      TimelinePlugin.create({

        container: '#waveform',
        height: 20,
        timeInterval: 1,

        insertPosition: 'afterbegin',
        primaryLabelInterval: 5,
        secondaryLabelInterval: 1000000,
        style: {
          fontSize: '10px',
          color: 'rgb(175 138 3)',
          backgroundColor: 'black',
          textDecorationColor: 'red',
          textAlign: 'center',
          borderBottom: '1px solid',
          bottom: '10px',
          zIndex:'3'
        }
      })
      // Add more plugins if necessary
    ]
  });


///////////////////////////
  }



   absoluteX=0
   isResizing = false;
   isResizing2 = false;
   parent = document.getElementById('parent');
   region = document.getElementById('region');
   currLeft=0;
   currRight=0;
   currWidth=0
   getPosition(event:MouseEvent) {


   let region = document.getElementById('region');


      if (region!.style.width === "0px") {
        this.isResizing = true;

        region!.style.left = `${event.offsetX }px`;
        this.currLeft = parseInt(region!.style.left, 10);
      } else {
        region!.style.width = '0';
        this.currWidth = 0;
      }




  }

   getPosition1(event: MouseEvent) {
    this.isResizing = true;
    event.stopPropagation();
    console.log(event.offsetX)




  }

   getPosition2(event:MouseEvent) {
    event.stopPropagation();
    this.isResizing2 = true;

  }

  startResize(event: MouseEvent) {
    let region = document.getElementById('region');
    let parent = document.getElementById('parent');
    if (this.isResizing && !this.isResizing2  ) {

      if (event.offsetX - this.currLeft > this.currWidth) {
        region!.style.width = `${Math.abs(event.offsetX - this.currLeft)}px`;
      } else  {

      if(event.offsetX+parseInt(region!.style.width, 10)>this.currLeft)
      {
        region!.style.width = `${Math.abs(this.currLeft -event.offsetX)}px`;

      }
      else if(event.offsetX<this.currWidth&&event.offsetX>4)
      {

      region!.style.width = `${this.currWidth-Math.abs(this.currWidth -event.offsetX)}px`;
      }

      }
    }

    if (this.isResizing2  ) {
       if(event.offsetX<this.currWidth) {
        region!.style.width = `${this.currWidth  - event.offsetX}px`;
        region!.style.left = `${this.currRight-parseInt(region!.style.width, 10)}px`;
        console.log('Absolute position:L', event.offsetX);
      }
      else if (this.currRight-event.offsetX  > this.currWidth &&event.offsetX>0) {
        region!.style.width = `${this.currRight - event.offsetX}px`;
        region!.style.left = `${event.offsetX}px`;
        console.log('Absolute position:L', this.currRight,this.currWidth, event.offsetX, 'x');
      }
    }
  }

   stopResize(event:MouseEvent){
   this.isResizing=false;
   this.isResizing2=false;
   let region = document.getElementById('region');
   let waveform = document.getElementById('wave');


    this.currWidth=parseInt(region!.style.width, 10);
    this.currLeft=parseInt(region!.style.left, 10);
    this.currRight=parseInt(region!.style.left, 10)+this.currWidth;
if(waveform)

  console.log("sds",this.waveformWidth)
      this.wave.wavesurfer.seekTo((parseInt(region!.style.left, 10)+5)/this.waveformWidth)
      this.wave.audio.currentTime=this.wave.wavesurfer.getCurrentTime();
this.global.startTimeOfRegion=this.wave.wavesurfer.getCurrentTime();
this.wave.wavesurfer.seekTo((parseInt(region!.style.left, 10)-5+this.currWidth)/this.waveformWidth)

this.global.endTimeOfRegion=this.wave.wavesurfer.getCurrentTime();

this.wave.audio.currentTime=this.wave.wavesurfer.getCurrentTime();

this.global.currWidth=this.currWidth;

if(this.currWidth!=0){
this.global.isRegion=true;
this.RegionChanged.emit(this.currWidth);
    }
    else{
    this.global.isRegion=false
    this.RegionChanged.emit(0);
    }

   }



    zoom(event: any): void {
    const myDiv = document.getElementById('waveform');
    let parent = document.getElementById('parent');
console.log("sdsdf",this.global.sampleViewWidth)
    if (event.ctrlKey && myDiv) {
        const delta = event.deltaY || event.detail || (event as any).wheelDelta;

        if (delta > 0) {
           // console.log('Zoom In');
           if(this.global.sampleViewWidth<myDiv.offsetWidth * 0.8)
            myDiv.style.width = `${myDiv.offsetWidth * 0.8}px`;
          else
          myDiv.style.width=this.global.sampleViewWidth+'px'
        } else if (delta < 0) {
            //console.log('Zoom Out');
            if((myDiv.offsetWidth * 1.2)+myDiv.offsetWidth<10001)
            myDiv.style.width = `${myDiv.offsetWidth * 1.2}px`;
          else
            myDiv.style.width='10000px'
        }
        this.waveformWidth=parseInt(myDiv.style.width, 10)
        event.preventDefault();
    }
   }
   zoomIn(){
    const myDiv = document.getElementById('waveform');
    if(this.waveformWidth<10000)
    myDiv!.style.width = `${myDiv!.offsetWidth * 1.2}px`;
    else
    myDiv!.style.width='10000px'
    this.waveformWidth=parseInt(myDiv!.style.width, 10)
   }
   zoomOut(){
    const myDiv = document.getElementById('waveform');
    if(this.global.sampleViewWidth<myDiv!.offsetWidth * 0.8)
    myDiv!.style.width = `${myDiv!.offsetWidth * 0.8}px`;
    else
    myDiv!.style.width='10000px'
    this.waveformWidth=parseInt(myDiv!.style.width, 10)
   }

}
