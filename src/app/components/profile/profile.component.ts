import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {ImageUploadService} from "../../services/image-upload.service";
import {HotToastService} from "@ngneat/hot-toast";
import {concatMap, switchMap, tap} from "rxjs";
import {NonNullableFormBuilder} from "@angular/forms";
import {UsersService} from "../../services/users.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ProfileUser} from "../../models/profile-user";

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = this.usersService.getCurrentUserProfile();

  profileForm = this.fb.group({
    uid: [''],
    displayName: [''],
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: [''],
  });

  constructor(
    private authService: AuthenticationService,
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private fb: NonNullableFormBuilder,
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    this.usersService.getCurrentUserProfile()
      .pipe(untilDestroyed(this), tap(console.log))
      .subscribe((user) => {
        this.profileForm.patchValue({...user});
      })
  }

  uploadFile(event: any, { uid }: ProfileUser) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `images/profile/${uid}`)
      .pipe(
        this.toast.observe({
          loading: 'La imagen se esta subiendo',
          success: 'La imagen se ha subido correctamente',
          error: 'Ha habido un error subiendo la imagen'
        }),
        switchMap((photoURL) =>
          this.usersService.updateUser({
            uid,
            photoURL
          })
        )
      )
      .subscribe();
  }

  saveProfile() {
    const { uid, ...data } = this.profileForm.value;

    if (!uid) {
      return;
    }

    this.usersService
      .updateUser({ uid, ...data })
      .pipe(
        this.toast.observe({
          loading: 'Actualizando los datos del perfil',
          success: 'Perfil actualizado correctamente',
          error: 'Ha habido un error actualizando el perfil',
        })
      )
      .subscribe();
  }

}
