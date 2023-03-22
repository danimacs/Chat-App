import {Component, ElementRef, Input, OnChanges, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {combineLatest, map, switchMap, tap} from "rxjs";
import {UsersService} from "../../../services/users.service";
import {ChatsService} from "../../../services/chats.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnChanges {

  @Input() chatListControl?: FormControl;
  @ViewChild('endOfChat') endOfChat!: ElementRef;

  user$ = this.usersService.getCurrentUserProfile();

  messageControl = new FormControl('');
  selectedChat$: any;
  messages$: any;

  constructor(
    private usersService: UsersService,
    private chatsService: ChatsService
  ) {
  }

  ngOnChanges(): void {
    this.getSelectedChat();
    this.getMessages();
  }

  scrollToBottom() {
    if (this.endOfChat) {
      setTimeout(() => this.endOfChat.nativeElement.scrollIntoView({behavior: "smooth"}), 100);
    }
  }

  sendMessage() {
    const message = this.messageControl.value;
    const selectedChatId = this.chatListControl?.value![0];

    if (message && selectedChatId) {
      this.chatsService.addChatMessage(selectedChatId, message).subscribe(() => this.scrollToBottom());
      this.messageControl.setValue('');
    }
  }

  private getMessages() {
    this.messages$ = this.chatListControl?.valueChanges.pipe(
      map(value => value![0]),
      switchMap(chatId => this.chatsService.getChatMessages$(chatId)),
      tap(() => this.scrollToBottom())
    );
  }

  private getSelectedChat() {
    if (this.chatListControl) {
      this.selectedChat$ = combineLatest([
        this.chatListControl.valueChanges,
        this.chatsService.getChats$(),
      ]).pipe(map(([value, chats]) => chats.find((chat) => chat.id === value![0])));
    }
  }
}
