import { Injectable } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';
import { endWith, startWith } from 'rxjs';
import regions from 'wavesurfer.js/dist/plugins/regions';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class WaveService {
  wavesurfer!: WaveSurfer;
  filters: BiquadFilterNode[] = [];
  audio!:HTMLMediaElement
  CurrentFile!:File|Blob;
  created:boolean=false;
  name=''
  private originalFilterValues: number[] = [];

  constructor(public loader:LoaderService) {

  }

  Init(CurrentFile: File|Blob, container: string,audio:HTMLMediaElement) {

    this.CurrentFile=CurrentFile;
    this.created=false;
    if (this.wavesurfer != null) {

      this.wavesurfer.destroy();
    }
    this.audio=audio;




    this.wavesurfer = WaveSurfer.create({
      container: container,
      waveColor: 'blue',
      progressColor: 'blue',
      cursorColor: 'red',
      height: 480,
      plugins: [
        TimelinePlugin.create({
          container: container,
          height: 20,
          timeInterval: 1,

          insertPosition: 'beforebegin',
          primaryLabelInterval: 5,
          secondaryLabelInterval: 1000000,
          style: {
            fontSize: '10px',
            color: 'rgb(175 138 3)',
            backgroundColor: 'black',
            textDecorationColor: 'aqua',
            textAlign: 'center',
            borderBottom: '1px solid',
            bottom: '10px',
            zIndex:'3'
          }
        })

      ]
    });

    if (CurrentFile) {

      this.wavesurfer.load(this.getAudioUrl(this.CurrentFile));
      audio.src = URL.createObjectURL(CurrentFile);
      audio.load();


    }





    // const url = URL.createObjectURL(CurrentFile);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'audio.mp3';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
this.created=true;
  }



  getAudioUrl(CurrentFile: File|Blob): string {
    return URL.createObjectURL(CurrentFile);
  }

  Play(canvas:HTMLCanvasElement) {

      if (this.wavesurfer.isPlaying()) {
        this.wavesurfer.pause();
        this.wavesurfer.setVolume(0)
        this.audio.pause(); // Pause the audio element
      } else {
        this.wavesurfer.play();

        this.audio.play(); // Start playing the audio element
        this.wavesurfer.setVolume(0)

      }


      if (this.audio) {
        this.audio.onplay = () => {
          console.log(this.audio)
          this.start(canvas);
        };
  }


  }
  start(canvas: HTMLCanvasElement) {
    var context = new AudioContext();
    var src = context.createMediaElementSource(this.audio);
    var analyser = context.createAnalyser();
  
    const ctx = canvas.getContext("2d");
    src.connect(analyser);
  
    const eqBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  
    this.filters = eqBands.map((band) => {
      const filter = context.createBiquadFilter();
      filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking';
      filter.gain.value = 0; // Default gain value
      filter.Q.value = 1; // resonance
      filter.frequency.value = band; // the cut-off frequency
      this.originalFilterValues.push(filter.gain.value); // Store original values for reset
      return filter;
    });
  
    const equalizer = this.filters.reduce((prev: AudioNode, curr: BiquadFilterNode) => {
      prev.connect(curr);
      return curr;
    }, src);
  
    equalizer.connect(context.destination);
  

  

  
    analyser.connect(context.destination);
  
    if (canvas && ctx) {
      canvas.width = 700;
      canvas.height = 270;
  
      analyser.fftSize = 512;
  
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
  
      var WIDTH = canvas.width;
      var HEIGHT = canvas.height;
  
      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight: any;
      var x = 0;
      var cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 10, // width of the meters in the spectrum
        gap = 2, // gap between meters
        capHeight = 2,
        capStyle = 'aqua',
        meterNum = 800 / (10 + 2); // count of the meters
      const capYPositionArray: number[] = []; // store the vertical position of the caps for the previous frame
      var gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, '#f00'); // Dark red
      gradient.addColorStop(0.5, '#0f0'); // Medium green
      gradient.addColorStop(1, '#00f');
  
      function renderFrame() {
        requestAnimationFrame(renderFrame);
  
        x = 0;
  
        analyser.getByteFrequencyData(dataArray);
        if (ctx) {
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);
          var step = Math.round(dataArray.length / bufferLength); // sample limited data from the total array
          ctx.clearRect(0, 0, cwidth, cheight);
          for (var i = 0; i < bufferLength; i++) {
            var value = dataArray[i * step];
            if (capYPositionArray.length < Math.round(bufferLength)) {
              capYPositionArray.push(value);
            }
            ctx.fillStyle = capStyle;
            // draw the cap, with transition effect
            if (value < capYPositionArray[i]) {
              ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
              ctx.fillRect(i * 12, WIDTH - barHeight, barWidth, barHeight);
              capYPositionArray[i] = value;
            }
  
            ctx.fillStyle = gradient // set the fillStyle to gradient for a better look
            ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight); // the meter
          }
        }
      }
      renderFrame();
    }
  }
  
   setupEqualizer(audio:HTMLAudioElement,sliderContainerRef: HTMLElement): void {

    // Handle AudioContext initialization for various browsers

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();

    const eqBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

     this.filters = eqBands.map((band) => {
      const filter = audioContext.createBiquadFilter();
      filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking';
      filter.gain.value = 0; // Default gain value
      filter.Q.value = 1; // resonance
      filter.frequency.value = band; // the cut-off frequency
      this.originalFilterValues.push(filter.gain.value); // Store original values for reset
      return filter;
    });

    const mediaNode = audioContext.createMediaElementSource(audio);

    const equalizer = this.filters.reduce((prev: AudioNode, curr: BiquadFilterNode) => {
      prev.connect(curr);
      return curr;
    }, mediaNode);

    equalizer.connect(audioContext.destination);

    // Create vertical sliders for each band and append to slider container
    this.filters.forEach((filter, index) => {
      const slider = sliderContainerRef.children[index] as HTMLInputElement;

      slider.style.appearance = 'slider-vertical';
      slider.style.width = '8%';
      slider.min = '-40';
      slider.max = '40';
      slider.value = filter.gain.value.toString();
      slider.step = '0.1';
      slider.oninput = (e) => {
        const inputElement = e.target as HTMLInputElement;
        filter.gain.value = parseFloat(inputElement.value);
      };

    });
  }

}
