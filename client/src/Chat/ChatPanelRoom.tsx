function ChatPanelRoom(props: any) {

    return (
        <div className={"chat-item d-flex pl-3 pr-0 pt-3 pb-3 " + (props.active ? 'active' : '')}>
            <div className="w-100">
                <div className="d-flex pl-0">
                    <img className="rounded-circle shadow avatar-sm mr-3"
                         src="https://user-images.githubusercontent.com/35243461/168796884-ee3aafb6-8083-48ec-9cfb-51b95eae08fe.jpg"/>
                    <p className="margin-auto fw-400 text-dark-75">{props.room}</p>
                </div>
            </div>
        </div>
    );
}

export default ChatPanelRoom;