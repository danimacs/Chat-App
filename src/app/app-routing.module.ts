import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LandingComponent} from "./components/landing/landing.component";
import {LoginComponent} from "./components/login/login.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {HomeComponent} from "./components/home/home.component";
import {canActivate, redirectUnauthorizedTo, redirectLoggedInTo} from "@angular/fire/auth-guard";
import {ProfileComponent} from "./components/profile/profile.component";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'profile',
    component: ProfileComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
