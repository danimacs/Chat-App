import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserInfo
} from "@angular/fire/auth";
import {concatMap, from, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser = authState(this.auth);

  constructor(
    private auth: Auth
  ) { }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  updateProfile(profileData: Partial<any>): Observable<any> {
    const user = this.auth.currentUser;
    return of(user).pipe(
         concatMap((user) => {
           if (!user) throw new Error('Not authenticated');

           return updateProfile(user, profileData);
         })
    );
  }

  logout(): Observable<any> {
    return from(this.auth.signOut());
  }
}
