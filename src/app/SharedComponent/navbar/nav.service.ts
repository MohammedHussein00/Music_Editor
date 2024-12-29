import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariablesService } from '../../Service/global-variables.service';
import { WaveService } from '../../Service/wave.service';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginResponse } from './login-response';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(private global: GlobalVariablesService,private http:HttpClient,private wave: WaveService) { }
  loginserve(x:FormGroup):Observable<LoginResponse>
  {

   return this.http.post<LoginResponse>('https://localhost:7213/api/Auth/Token',x.value);
  }
}
