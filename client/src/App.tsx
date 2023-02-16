import './App.css';
import ChatPanel from "./Chat/ChatPanel";
import ChatContainer from "./Chat/ChatContainer";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {useEffect, useState} from "react";

function App() {
    const [nickname, setNickname] = useState<string>("");

    useEffect(() => {
        promptNickname(setNickname);
    }, []);

    return (
        <div className="container mt-5">
            <main className="row">
                <ChatPanel nickname={nickname}/>
                <ChatContainer/>
            </main>
        </div>
    );
}

function promptNickname(setNickname: (value: (((prevState: string) => string) | string)) => void) {
    const MySwal = withReactContent(Swal)

    MySwal.fire({
        title: 'Enter your nickname',
        input: 'text',
        inputValidator: (value) => getInputValidator(value)
    }).then((response) => {
        setNickname(response.value)
    });

    function getInputValidator(value: string) {
        if (!value) {
            return 'You need to write something!'
        }
    }
}

export default App;
