import {Component, OnInit} from '@angular/core';
import {NonNullableFormBuilder, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private toast: HotToastService
  ) {
  }

  ngOnInit() {
  }

  getEmail() {
    return this.loginForm.get('email');
  }

  getPassword() {
    return this.loginForm.get('password');
  }

  submit() {

    const { email, password } = this.loginForm.value;

    if (!this.loginForm.valid || !email || !password) {
      return;
    }

    this.authService
      .login(email, password)
      .pipe(
        this.toast.observe({
          success: 'Inicio de sesión correcto',
          loading: 'Iniciando sesión',
          error: 'Error en el inicio de sesión'
        })
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
    });

  }

}
