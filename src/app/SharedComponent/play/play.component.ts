import { Component,ElementRef,EventEmitter ,HostListener,Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GlobalVariablesService } from '../../Service/global-variables.service';
import { WaveService } from '../../Service/wave.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
    
  ],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent  implements OnChanges, OnInit {
  @Input() receivedData!: Blob;
  CurrentFile!: Blob;
  isPlaying = false;
  currentTimeInSeconds = 0;
  currentTimeInMinutes = 0;
  currentTimeInHours = 0;
  hours:string='00'
  minutes:string='00'
  startHours:string='00'
  startMinutes:string='00'
  endHours:string='00'
  endMinutes:string='00'
  lengthHours:string='00'
  lengthMinutes:string='00'
  startCropSeconds:number = 0;
  startCropMinutes:number = 0;
  startCropHours:number = 0;
  endCropSeconds:number = 0;
  endCropMinutes:number = 0;
  endCropHours:number = 0;
  lengthCropSeconds:number = 0;
  lengthCropMinutes:number = 0;
  lengthCropHours:number = 0;
  currentSpeed=1;
  rangeSpeed:boolean=false;
  goToEnd:boolean=false;
  backForward:boolean=false;
  playAgain:boolean=false;
  created:boolean=false;
  @Input() addedRegion2!: number;
  @ViewChild('speed') element1: ElementRef | undefined;
  @ViewChild('range') parent: ElementRef | undefined;
  
  constructor(private wave: WaveService,private global:GlobalVariablesService) {
  }

  ngOnInit(): void {
    this.wave.wavesurfer.setPlaybackRate(this.currentSpeed);
    this.wave.audio.playbackRate=this.currentSpeed;

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.CurrentFile = this.receivedData;


this.isPlaying=false

    if (this.receivedData != null) {
      this.wave.wavesurfer.on('ready', () => {
        this.created=true;

      })

      this.wave.wavesurfer.on('audioprocess', () => {
        const currentTime = this.wave.wavesurfer.getCurrentTime();
        if(this.wave.wavesurfer.getCurrentTime()<=59)
        {
        this.currentTimeInSeconds = parseFloat(this.wave.wavesurfer.getCurrentTime().toFixed(3));
        }
      else if(this.wave.wavesurfer.getCurrentTime()%60<60)
      {
      this.currentTimeInSeconds = parseFloat((this.wave.wavesurfer.getCurrentTime()%60).toFixed(3));
      }

        this.currentTimeInMinutes = Math.floor(this.wave.wavesurfer.getCurrentTime()/60);
         this.minutes = this.currentTimeInMinutes.toString().padStart(2, '0');

        this.currentTimeInHours = Math.floor(this.wave.wavesurfer.getCurrentTime()/(60*60));

        this.hours = this.currentTimeInHours.toString().padStart(2, '0');

        if (currentTime >= this.wave.wavesurfer.getDuration()&&!this.playAgain) {
          this.isPlaying = false;
        }
        if(this.playAgain&&currentTime >= this.wave.wavesurfer.getDuration()){
        this.wave.wavesurfer.seekTo(0);
this.playAudio()
this.isPlaying=true
}
if(this.global.currWidth!=0&&this.wave.wavesurfer.getCurrentTime()>=this.global.endTimeOfRegion){
this.wave.wavesurfer.seekTo(this.global.startTimeOfRegion/this.wave.wavesurfer.getDuration())
this.wave.audio.currentTime=this.wave.wavesurfer.getCurrentTime()

}
if(this.goToEnd){
  this.wave.wavesurfer.seekTo(1);
  this.goToEnd=false
  }
  if(this.backForward){
  this.wave.wavesurfer.seekTo(0);
  this.backForward=false
  }

      });
    }
    if(this.addedRegion2!=0)
    {

            ///start crop
            if(this.global.startTimeOfRegion<=59)
            {
              this.startCropSeconds = parseFloat(this.global.startTimeOfRegion.toFixed(3));
            }
          else if(this.global.startTimeOfRegion%60<60)
          {
            this.startCropSeconds = parseFloat((this.global.startTimeOfRegion%60).toFixed(3));
          }

            this.startCropMinutes = Math.floor(this.global.startTimeOfRegion/60);
             this.startMinutes = this.startCropMinutes.toString().padStart(2, '0');

            this.startCropHours = Math.floor(this.global.startTimeOfRegion/(60*60));

            this.startHours = this.startCropHours.toString().padStart(2, '0');
       ///start crop


       ///end crop



       if(this.global.endTimeOfRegion<=59)
       {
         this.endCropSeconds = parseFloat(this.global.endTimeOfRegion.toFixed(3));
       }
     else if(this.global.endTimeOfRegion%60<60)
     {
       this.endCropSeconds = parseFloat((this.global.endTimeOfRegion%60).toFixed(3));
     }

       this.endCropMinutes = Math.floor(this.global.endTimeOfRegion/60);
        this.endMinutes = this.endCropMinutes.toString().padStart(2, '0');

       this.endCropHours = Math.floor(this.global.endTimeOfRegion/(60*60));

       this.endHours = this.endCropHours.toString().padStart(2, '0');
    ///end crop
 ///lenght crop


var length=this.global.endTimeOfRegion-this.global.startTimeOfRegion
 if(length<=59)
 {
   this.lengthCropSeconds = parseFloat(length.toFixed(3));
 }
else if(length%60<60)
{
 this.lengthCropSeconds = parseFloat((length%60).toFixed(3));
}

 this.lengthCropMinutes = Math.floor(length/60);
  this.lengthMinutes = this.lengthCropMinutes.toString().padStart(2, '0');

 this.lengthCropHours = Math.floor(length/(60*60));

 this.lengthHours = this.lengthCropHours.toString().padStart(2, '0');
///lenght crop

    }
    else{
      this.lengthCropSeconds=0;
      this.lengthHours='00';
      this.lengthMinutes='00'
      this.startHours='00';
      this.startMinutes='00';
      this.endMinutes='00';
      this.endHours='00';
      this.startCropSeconds=0;
      this.endCropSeconds=0;



    }

  }
  puase()
  {
    this.wave.wavesurfer.pause();
    this.wave.audio.pause()
    this.isPlaying=false;

  }
goToTheEnd(){
  if(this.wave.wavesurfer.isPlaying()){
this.goToEnd=true
  }

}
BackForward(){
  if(this.wave.wavesurfer.isPlaying())
this.backForward=true
  }
  increaseSpeed() {
    if(this.wave.wavesurfer.getPlaybackRate()<=7){
    this.wave.wavesurfer.setPlaybackRate(this.wave.wavesurfer.getPlaybackRate() + 1);
    this.wave.audio.playbackRate=this.wave.audio.playbackRate+1;
  this.currentSpeed=this.wave.wavesurfer.getPlaybackRate();
}
  }

  decreaseSpeed() {
    if(this.wave.wavesurfer.getPlaybackRate()>=2){
    this.wave.wavesurfer.setPlaybackRate(this.wave.wavesurfer.getPlaybackRate() - 1);
    this.currentSpeed=this.wave.wavesurfer.getPlaybackRate();
    this.wave.audio.playbackRate=this.wave.audio.playbackRate-1;
    }

  }
  playRepeat()
  {
    if(this.playAgain)
    this.playAgain=false
  else
  this.playAgain=true
  }
  updatePlaybackRate() {
    this.wave.wavesurfer.setPlaybackRate(this.currentSpeed);
    this.wave.audio.playbackRate = this.currentSpeed;
  }
  @HostListener('document:click', ['$event'])
  onclick(event: MouseEvent) {
    if(this.element1?.nativeElement === event.target)
    {
     this.rangeSpeed=!this.rangeSpeed;

    }
    else if(this.parent?.nativeElement !== event.target){
    this.rangeSpeed=false;

    }
    }
  playAudio(): void {
var canvas=document.getElementById('canvas') as HTMLCanvasElement;

    if (this.isPlaying === false) {
      this.wave.Play(canvas);
      this.isPlaying = true;
    } else {
      this.wave.Play(canvas);
      this.isPlaying = false;
    }
  }

  getAudioUrl(): string {
    return URL.createObjectURL(this.CurrentFile);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      this.playAudio();
    }
  }
}
