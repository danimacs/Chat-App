import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import ChatPanelRoom from "./ChatPanelRoom";
import {Session} from "../../../models/Session";

const ENDPOINT = "ws://localhost:3000";

function ChatPanel() {
    const [socket, setSocket] = useState<any>(null);
    const [rooms, setRooms] = useState<string[]>([]);

    useEffect(() => {
        const newSocket = io(ENDPOINT);
        setSocket(newSocket);

        newSocket.on('welcome-user', (session: Session) => {
            setRooms(session.rooms);
        });

        newSocket.on('new-room', (room: string) => {
            setRooms(rooms => [...rooms, room]);
        });

        return () => {
            newSocket.disconnect();
        }
    }, []);

    return (
        <div className="col-md-4 col-12 card-stacked">
            <div className="card shadow-line mb-3 chat">
                <div className="chat-user-detail">
                    <div className="p-3 chat-header">
                        <div className="d-flex flex-row mt-1 mb-1">
                            <span className="margin-auto mr-2">
                                <a href="#"
                                   className="user-undetail-trigger btn btn-sm btn-icon btn-light active text-dark ml-2">
                                    <svg viewBox="0 0 24 24" width="18" height="18"
                                         stroke="currentColor" stroke-width="2"
                                         fill="none" stroke-linecap="round"
                                         stroke-linejoin="round" className="feather">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </a>
                            </span>
                            <p className="margin-auto fw-400 text-dark-75">Profile</p>
                        </div>
                    </div>

                    <div className="p-3 chat-user-info">
                        <div className="card-body text-center">
                            <a href="#!">
                                <img className="rounded-circle img-fluid shadow avatar-xxl"
                                     src="https://user-images.githubusercontent.com/35243461/168796876-2e363a49-b32c-4218-b5a3-ce12493af69e.jpg"/>
                            </a>

                            <div className="pt-4 text-center animate4">
                                <h6 className="fw-300 mb-1">Quan Albert</h6>
                                <p className="text-muted">Web Developer</p>
                                <div className="mt-4">
                                    <a href="#"
                                       className="btn btn-light-skype btn-icon btn-circle btn-sm btn-shadow mr-2"><i
                                        className="bx bxl-skype"></i></a>
                                    <a href="#"
                                       className="btn btn-light-facebook btn-icon btn-circle btn-sm btn-shadow mr-2"><i
                                        className="bx bxl-facebook"></i></a>
                                    <a href="#"
                                       className="btn btn-light-twitter btn-icon btn-circle btn-sm btn-shadow mr-2"><i
                                        className="bx bxl-twitter"></i></a>
                                    <a href="#"
                                       className="btn btn-light-instagram btn-icon btn-circle btn-sm btn-shadow mr-2"><i
                                        className="bx bxl-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-3 chat-header">
                    <div className="d-flex">
                        <div className="w-100 d-flex pl-0">
                            <img
                                className="user-detail-trigger rounded-circle shadow avatar-sm mr-3 chat-profile-picture"
                                src="https://user-images.githubusercontent.com/35243461/168796876-2e363a49-b32c-4218-b5a3-ce12493af69e.jpg"/>
                        </div>

                        <div className="flex-shrink-0 margin-auto">
                            <a href="#" className="btn btn-sm btn-icon btn-light active text-dark ml-2">
                                <svg viewBox="0 0 24 24" width="15" height="15"
                                     stroke="currentColor" stroke-width="2" fill="none"
                                     stroke-linecap="round" stroke-linejoin="round"
                                     className="feather">
                                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                                    <polyline points="17 2 12 7 7 2"></polyline>
                                </svg>
                            </a>

                            <a href="#" className="btn btn-sm btn-icon btn-light active text-dark ml-2">
                                <svg viewBox="0 0 24 24" width="15" height="15"
                                     stroke="currentColor" stroke-width="2" fill="none"
                                     stroke-linecap="round" stroke-linejoin="round"
                                     className="feather">
                                    <path d="M12 20h9"></path>
                                    <path
                                        d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </a>

                            <a href="#" className="btn btn-sm btn-icon btn-light active text-dark ml-2">
                                <svg viewBox="0 0 24 24" width="15" height="15"
                                     stroke="currentColor" stroke-width="2" fill="none"
                                     stroke-linecap="round" stroke-linejoin="round"
                                     className="feather">
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="12" cy="5" r="1"></circle>
                                    <circle cx="12" cy="19" r="1"></circle>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="chat-search pl-3 pr-3">
                    <div className="input-group">
                        <input type="text" className="form-control"
                               placeholder="Search a conversation"/>
                        <div className="input-group-append prepend-white">
                            <span className="input-group-text pl-2 pr-2">
                                <i className="fs-17 las la-search drop-shadow"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="chat-panel-room">
                    <div className="pb-3 d-flex flex-column navigation-mobile pagination-scrool chat-user-scroll">
                        {
                            rooms.map((room, i) => (
                                    <ChatPanelRoom key={i} room={room} active={room === socket.id}/>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatPanel;