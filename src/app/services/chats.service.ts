import {Injectable} from '@angular/core';
import {addDoc, collection, collectionData, doc, Firestore, orderBy, query, Timestamp, updateDoc, where} from "@angular/fire/firestore";
import {concatMap, map, Observable, take, tap} from "rxjs";
import {UsersService} from "./users.service";
import {Chat, Message} from "../models/chat";
import {ProfileUser} from "../models/profile-user";

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(
    private firestore: Firestore,
    private usersService: UsersService
  ) {
  }

  createChat(otherUser: ProfileUser): Observable<string> {
    const ref = collection(this.firestore, 'chats');

    return this.usersService.getCurrentUserProfile().pipe(
      take(1),
      concatMap(user => addDoc(ref, {
        userIds: [user?.uid, otherUser?.uid],
        users: [
          {
            displayName: user?.displayName ?? '',
            photoURL: user?.photoURL ?? '',
          },
          {
            displayName: otherUser.displayName ?? '',
            photoURL: otherUser.photoURL ?? '',
          }
        ]
      })),
      map(ref => ref.id)
    )
  }

  getChat(otherUser: ProfileUser): Observable<string | null> {
    return this.getChats$().pipe(
      take(1),
      map((chats: Chat[]) => {
        let chat: Chat | undefined = chats.find((chat) => chat.userIds.includes(otherUser?.uid));
        return chat != null ? chat.id : null;
      })
    ).pipe(tap(chatId => !chatId ? this.createChat(otherUser) : chatId));
  }

  getChats$(): Observable<Chat[]> {
    const ref = collection(this.firestore, 'chats');
    return this.usersService.getCurrentUserProfile().pipe(
      concatMap((user) => {
        const myQuery = query(ref, where('userIds', 'array-contains', user?.uid));
        return collectionData(myQuery, {idField: 'id'}).pipe(
          map(chats => this.addChatNameAndPic(user?.uid ?? '', chats as Chat[]))
        ) as Observable<Chat[]>
      })
    )
  }

  addChatNameAndPic(currentUserId: string, chats: Chat[]): Chat[] {
    chats.forEach((chat: Chat) => {
      const otherIndex = chat.userIds.indexOf(currentUserId) === 0 ? 1 : 0;
      const {displayName, photoURL} = chat.users[otherIndex];
      chat.chatName = displayName;
      chat.chatPic = photoURL;
    })

    return chats;
  }

  addChatMessage(chatId: string, message: string): Observable<any> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const chatRef = doc(this.firestore, 'chats', chatId);
    const today = Timestamp.fromDate(new Date());

    return this.usersService.getCurrentUserProfile().pipe(
      take(1),
      concatMap((user) => addDoc(ref, {
        text: message,
        senderId: user?.uid,
        sentDate: today
      })),
      concatMap(() => updateDoc(chatRef, {lastMessage: message, lastMessageDate: today}))
    );
  }

  getChatMessages$(chatId: string): Observable<Message[]> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const queryAll = query(ref, orderBy('sentDate', 'asc'));
    return collectionData(queryAll) as Observable<Message[]>;
  }

}
