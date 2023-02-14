import './App.css';
import ChatPanel from "./Chat/ChatPanel";
import ChatContainer from "./Chat/ChatContainer";

function App() {
    return (
        <div className="container mt-5">
            <main className="row">
                <ChatPanel />
                <ChatContainer />
            </main>
        </div>
    );
}

export default App;
