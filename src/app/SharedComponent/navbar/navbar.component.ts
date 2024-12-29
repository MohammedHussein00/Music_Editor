import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Use Angular's Router
import { NavService } from './nav.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from './login-response';

declare const google: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    HttpClientModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']  // Corrected styleUrls
})
export class NavbarComponent {
  base64: string | null = 'assets/profile1.png';
  name: string | null = '';
  displayModal: boolean = false;
  imagePath: string | null = '';
  isLogin: boolean = false;
  public login: FormGroup;
  messageError: boolean = false;
  email: string | null = '';

  constructor(private router: Router,private http:HttpClient) {
    this.login = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  ngOnInit() {
    if (localStorage.getItem("imagePath")) {
      this.base64 = localStorage.getItem("imagePath");
    }

    this.login.valueChanges.subscribe(() => {
      this.messageError = false;
    });

    if (localStorage.getItem('token')) {
      this.isLogin = true;
    }

    const storedImagePath = localStorage.getItem('imagePath');
    this.imagePath = storedImagePath !== 'null' ? storedImagePath : null;
    this.name = localStorage.getItem('name');
    this.email = localStorage.getItem('Email');
  }

  logout() {
    this.isLogin = false;
    localStorage.clear();
  }

  loginFun() {
    if (this.login.valid) {
      this.messageError = false;
      this.loginserve(this.login).subscribe(s => {
        if (s.message === "Email or Password is Incorrect") {
          this.messageError = true;
        } else {
          this.name = s.name;
          this.isLogin = true;
          this.imagePath = s.imagePath;
          localStorage.setItem('token', s.token);
          localStorage.setItem('name', s.name);
          localStorage.setItem('imagePath', s.imagePath);
          localStorage.setItem('Email', s.email);

          for (let i = 0; i < s.roles.length; i++) {
            localStorage.setItem(`role${i + 1}`, s.roles[i]);
          }
          this.displayModal = false;
        }
      });
    }
  }

  loginWithGoogle() {
    window.location.href = 'https://localhost:7213/api/Auth/google';
  }

  open() {
    this.displayModal = true;
  }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: "Your-Google-Client-ID",
      callback: this.handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "dark", size: "large" }
    );

    google.accounts.id.prompt();
  }

  onHide() {
    this.displayModal = true;
  }

  handleCredentialResponse(response: any) {
    console.log("Encoded JWT ID token: " + response.credential);
  }
  loginserve(x:FormGroup):Observable<LoginResponse>
  {

   return this.http.post<LoginResponse>('https://localhost:7213/api/Auth/Token',x.value);
  }
}
