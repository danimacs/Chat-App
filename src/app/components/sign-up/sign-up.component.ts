import {Component, OnInit} from '@angular/core';
import {AbstractControl, NonNullableFormBuilder, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";
import {UsersService} from "../../services/users.service";
import {switchMap} from "rxjs";

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  },
    { validators: passwordMatchValidator()}
  );

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthenticationService,
    private toast: HotToastService,
    private router: Router,
    private usersService: UsersService
  ) {
  }

  ngOnInit() {
  }

  getName() {
    return this.signUpForm.get('name');
  }

  getEmail() {
    return this.signUpForm.get('email');
  }

  getPassword() {
    return this.signUpForm.get('password');
  }

  getConfirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  submit() {

    const { name, email, password } = this.signUpForm.value;

    if (!this.signUpForm.valid || !name || !password || !email) {
      return;
    }

    this.authService
      .signUp(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.usersService.addUser({ uid, email, displayName: name })
        ),
        this.toast.observe({
          success: 'Has sido registrado correctamente',
          loading: 'Registrandote',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
      })
  }

}
