import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  startTimeOfRegion:number=0
  endTimeOfRegion:number=0
  isRegion:boolean=false;
  FileChanges!:Blob;
  cutedPart!:Blob;
  private isRegionSubject = new BehaviorSubject<boolean>(false);
  isRegion$ = this.isRegionSubject.asObservable();
currWidth:number=0;
sampleViewWidth:number=0
  setIsRegion(value: boolean) {
    this.isRegionSubject.next(value);
  }
  croped:boolean=false;
  constructor() { }

}
