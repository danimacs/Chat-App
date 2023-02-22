import React, {ReactNode, useEffect, useState} from "react";
import ContextMenu from "./ContextMenu";
import {Menu, MenuItem} from "@mui/material";



function ChatPanelRoom(props: any) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={"chat-item d-flex pl-3 pr-0 pt-3 pb-3 " + (props.active ? 'active' : '')}>
            <div className="w-100">
                <div
                    id="basic-button"
                    onAuxClick={(e) => {
                        debugger;
                        e.preventDefault()
                        handleClick(e)
                    }
                    }
                    style={{cursor: "pointer"}}
                    className="d-flex pl-0">
                    <img className="rounded-circle shadow avatar-sm mr-3"
                         src="https://user-images.githubusercontent.com/35243461/168796884-ee3aafb6-8083-48ec-9cfb-51b95eae08fe.jpg"/>
                    <p className="margin-auto fw-400 text-dark-75">{props.room}</p>
                </div>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>

            </div>
        </div>
    );
}

export default ChatPanelRoom;


