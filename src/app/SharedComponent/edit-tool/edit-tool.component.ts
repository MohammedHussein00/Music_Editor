import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import bootstrap from '../../../main.server';
import { GlobalVariablesService } from '../../Service/global-variables.service';
import { WaveService } from '../../Service/wave.service';
import { Observable } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-edit-tool',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './edit-tool.component.html',
  styleUrl: './edit-tool.component.scss'
})
export class EditToolComponent  implements OnChanges {
  isRegion: boolean = false;

  @Input() receivedData!: boolean;
  @Input() addedRegion!: number;
  @Input() FileChangedAfterProcess!: Blob;

  @Output() sendFile!: EventEmitter<File|Blob>;
  @Output() croped!: EventEmitter<boolean>;
  audio!:HTMLMediaElement;
FilerRecive!:Blob;
  constructor(private global: GlobalVariablesService,private http:HttpClient,private wave: WaveService) {
    this.sendFile=new EventEmitter<File|Blob>();
    this.croped=new EventEmitter<boolean>();
  }

  ngOnChanges(changes: SimpleChanges): void {
if(this.addedRegion!=0)
{
      this.isRegion = true;


}
else{
  this.isRegion=false
}
if(this.FileChangedAfterProcess){
  this.FilerRecive=this.FileChangedAfterProcess;
}
  }

  cutPart() {
    const storedToken = localStorage.getItem('token');

    if (storedToken === null || storedToken === '') {
      console.log("done");

  var x=document.getElementById('exampleModal');


}
else{

  var selectedPart=new FormData();
  var temp=localStorage.getItem('Email');
    selectedPart.append('start', this.global.startTimeOfRegion.toString())
    selectedPart.append('path',temp ?? '' )
    selectedPart.append('end', this.global.endTimeOfRegion.toString());
    selectedPart.append('file', this.global.FileChanges)

    this.cutPartAPI(selectedPart).subscribe(
      (response: Blob) => {

        this.sendFile.emit(response);

        this.croped.emit(true);
        this.global.croped=true
        this.global.FileChanges=response;
      }

    );
    this.cutedPart(temp).subscribe((respone)=>{
this.global.cutedPart=respone;
    })

  }
  }

  isValidBase64String(base64String: string): boolean {
    // Verify if the string is a valid Base64 string
    const validBase64Regex = /^[A-Za-z0-9+/=]+$/;
    return validBase64Regex.test(base64String);
  }

   decodeBase64String(base64String: string): Uint8Array {
    // Decode Base64 string to byte array
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  }

   downloadFileFromBase64(base64String: string, fileName: string,fileType:string): Blob {
    if (!this.isValidBase64String(base64String)) {
      console.error('Invalid Base64 string');

    }


    const byteArray = this.decodeBase64String(base64String);

    // Create Blob from byte array
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    // Convert Blob to File
    const file = new File([blob], fileName, { type: blob.type });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Trigger a click event to initiate the download
    link.click();

    // Cleanup
    URL.revokeObjectURL(link.href);
    return blob;
  }
  cutPartAPI(x: FormData): Observable<Blob> {

    return this.http.post('https://localhost:7213/api/Edit/Remove', x, { responseType: 'blob' });
  }
  cutedPart(path:string|null): Observable<Blob> {

    return this.http.post('https://localhost:7213/api/Edit/cutedPart',path, { responseType: 'blob' });
  }
}
