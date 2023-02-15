export class Session {
    rooms: string[];

    constructor(room: string, rooms: string[]) {
        this.rooms = rooms;
    }
}