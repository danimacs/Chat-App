import { Timestamp } from '@angular/fire/firestore';
import {ProfileUser} from "./profile-user";

export interface Chat {
  id: string;
  lastMessage?: string;
  lastMessageDate?: Date & Timestamp;
  userIds: string[];
  users: ProfileUser[];

  // No se guarda, es solo para mostrar
  chatPic?: string;
  chatName?: string;
}

export interface Message {
  text: string;
  senderId: string;
  sentDate: Date & Timestamp;
}
