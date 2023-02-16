import React, {useState} from "react";

function ChatPanelRoom(props: any) {
    const [room, setRoom] = useState<string>("");

    function handleChange(event: { target: { value: any; }; }) {
       let room = event.target.value;
       setRoom(room);
    }

    function onSubmit() {
        // @ts-ignore
        event.preventDefault()

        props.socket.emit('create-room', room);
    }

    return (
        <div className="chat-search pl-3 pr-3">
            <div className="input-group">
                <form onSubmit={onSubmit}>
                    <input type="text" value={room} onChange={handleChange}  className="form-control" placeholder="Create room"/>
                </form>
                <div className="input-group-append prepend-white">
                    <span className="input-group-text pl-2 pr-2">
                        <i className="fs-17 las la-search drop-shadow"></i>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ChatPanelRoom;