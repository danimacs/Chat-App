import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {FormControl} from "@angular/forms";
import {combineLatest, map, of, startWith, switchMap, tap} from "rxjs";
import {ProfileUser} from "../../models/profile-user";
import {ChatsService} from "../../services/chats.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('endOfChat') endOfChat!: ElementRef;

  user$ = this.usersService.getCurrentUserProfile();
  myChats$ = this.chatsService.getMyChats$();

  searchControl = new FormControl('');
  chatListControl = new FormControl('');
  messageControl = new FormControl('');


  otherUsers$ = combineLatest([this.usersService.getAllUsers(), this.user$]).pipe(
    map(([users, user]) => users.filter((u) => u.uid !== user?.uid))
  );

  users$ = combineLatest([
    this.otherUsers$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, searchString]) => {
      return users.filter((u) =>
        u.displayName?.toLowerCase().includes(searchString!.toLowerCase())
      );
    })
  );

  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges,
    this.myChats$,
  ]).pipe(map(([value, chats]) => chats.find((c) => c.id === value![0])));

  messages$ = this.chatListControl.valueChanges.pipe(
    map(value => value![0]),
    switchMap(chatId => this.chatsService.getChatMessages$(chatId)),
    tap(() => {
      this.scrollToBottom();
    })
  );

  constructor(
    private usersService: UsersService,
    private chatsService: ChatsService
  ) {
  }

  ngOnInit(): void {
  }

  createChat(otherUser: ProfileUser) {
    this.chatsService.isExistingChat(otherUser?.uid).pipe(
      switchMap(chatId => {
        if (!chatId) {
          return this.chatsService.createChat(otherUser);
        } else {
          return of(chatId);
        }
      })
    ).subscribe(chatId => {
      this.chatListControl.setValue(chatId);
    });
  }

  sendMessage() {
    const message = this.messageControl.value;
    const selectedChatId = this.chatListControl.value![0];

    if(message && selectedChatId) {
      this.chatsService.addChatMessage(selectedChatId, message).subscribe(() => {
        this.scrollToBottom();
      });
      this.messageControl.setValue('');
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }
}
