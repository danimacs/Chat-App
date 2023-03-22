import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {combineLatest, map, startWith} from "rxjs";
import {UsersService} from "../../../services/users.service";
import {ChatsService} from "../../../services/chats.service";
import {ProfileUser} from "../../../models/profile-user";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() chatListControl?: FormControl;
  searchControl = new FormControl('');

  user$ = this.usersService.getCurrentUserProfile();
  myChats$ = this.chatsService.getChats$();

  users$: any;

  constructor(
    private usersService: UsersService,
    private chatsService: ChatsService
  ) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  selectChat(otherUser: ProfileUser) {
    this.chatsService.getChat(otherUser).subscribe(chatId => {
      this.chatListControl?.reset(chatId);
    });
  }

  private getUsers() {
    const allUsers$ = this.usersService.getAllUsers();
    const otherUsers = combineLatest([allUsers$, this.user$]).pipe(
      map(([allUsers, user]) => allUsers.filter((allUser) => allUser.uid !== user?.uid))
    );

    this.users$ = combineLatest([otherUsers, this.searchControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([users, searchString]) => {
        return users.filter((u) => {
          let displayName: string | undefined = u.displayName?.toLowerCase();
          searchString = searchString!.toLowerCase();
          return displayName?.includes(searchString);
        })
      })
    );
  }
}
