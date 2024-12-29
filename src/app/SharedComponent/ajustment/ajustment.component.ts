import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';
import { WaveService } from '../../Service/wave.service';
@Component({
  selector: 'app-ajustment',
  standalone: true,
  imports: [
    FormsModule,
    KnobModule,
    ReactiveFormsModule
  ],
  templateUrl: './ajustment.component.html',
  styleUrl: './ajustment.component.scss'
})
export class AjustmentComponent implements OnChanges, OnInit {
  value1: number = 0;
  value2: number = 0;
  value3: number = 0;
  value4: number = 0;
  value5: number = 0;
  value6: number = 0;
  value7: number = 0;
  value8: number = 0;
  value9: number = 0;
  value10: number = 0;

  @Input() height: number = 0;
  h: number = 0;
  @ViewChild('test') containerRef: ElementRef | undefined;
  @ViewChildren('knob') knobRefs!: QueryList<ElementRef>;

  constructor(private waveService: WaveService) {}

  ngOnInit() {
    this.updateKnobs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.h = this.height;
  }

  updateFilter(index: number, value: number) {
    if (this.waveService.filters[index]) {
      this.waveService.filters[index].gain.value = value;
    }
  }

  updateKnobs() {
    // Call this method after the view is fully initialized
    this.knobRefs.forEach((knob, index) => {
      const knobElement = knob.nativeElement as any;
      if (knobElement) {
        knobElement.value = this.waveService.filters[index]?.gain.value || 0;
      }
    });
  }
}
